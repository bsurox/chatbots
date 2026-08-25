// FILE: lib/db/foreman.ts
import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { db } from "./queries";

// ForemanPrep data layer. Same pattern as video-jobs.ts: the tables
// were created directly in Postgres via setup SQL (Day 3), these
// definitions just let us query them type-safely, and every helper
// the product needs lives in this one file.
// v2 - the plan column now carries WHICH product was bought, with
// no schema change and no migration:
//   "full"   = ForemanPrep Full Access (every existing row)
//   "bl"     = Business & Law prep only
//   "bundle" = both products
// hasForemanAccess answers for the GC exam product exactly as
// before (existing "full" rows are untouched and keep working);
// hasBlAccess answers for Business & Law; grantForemanAccess now
// MERGES: buying the second product upgrades the row to "bundle",
// and a grant can never downgrade or overwrite what someone
// already owns.
// v3: product "bundle" - the buy-both-at-once purchase. It grants
// the bundle plan directly (and merging is trivial: whatever you
// held before, owning both is strictly more).

export const foremanAccess = pgTable("foreman_access", {
  userId: uuid("user_id").primaryKey(),
  plan: text("plan").notNull().default("full"),
  source: text("source").notNull().default("stripe"),
  grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const foremanAttempts = pgTable("foreman_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  mode: text("mode").notNull(),
  domain: text("domain"),
  total: integer("total").notNull().default(0),
  correct: integer("correct").notNull().default(0),
  finished: boolean("finished").notNull().default(false),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
});

export const foremanAnswers = pgTable(
  "foreman_answers",
  {
    attemptId: uuid("attempt_id").notNull(),
    userId: uuid("user_id").notNull(),
    questionId: text("question_id").notNull(),
    domain: text("domain").notNull(),
    picked: integer("picked").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    answeredAt: timestamp("answered_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.attemptId, table.questionId] }),
  })
);

export type ForemanAccess = typeof foremanAccess.$inferSelect;
export type ForemanAttempt = typeof foremanAttempts.$inferSelect;

// ---- Access (the paywall asks this) ------------------------------

async function getAccessRow(userId: string): Promise<ForemanAccess | null> {
  const rows = await db
    .select()
    .from(foremanAccess)
    .where(eq(foremanAccess.userId, userId));
  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return null;
  return row;
}

// GC exam product (Full Access). Any plan except a bl-only row
// counts - "full", "bundle", and any legacy value all keep working.
export async function hasForemanAccess(userId: string): Promise<boolean> {
  const row = await getAccessRow(userId);
  if (!row) return false;
  return row.plan !== "bl";
}

// Business & Law product.
export async function hasBlAccess(userId: string): Promise<boolean> {
  const row = await getAccessRow(userId);
  if (!row) return false;
  return row.plan === "bl" || row.plan === "bundle";
}

export async function grantForemanAccess(params: {
  userId: string;
  source?: string;
  product?: "gc" | "bl" | "bundle";
  expiresAt?: Date | null;
}) {
  const source = params.source ?? "stripe";
  const product = params.product ?? "gc";
  const expiresAt = params.expiresAt ?? null;

  // Merge with what the user already owns. An expired row does not
  // merge - it counts as owning nothing, so a new purchase cannot
  // resurrect a lapsed product for free.
  const existing = await getAccessRow(params.userId);
  let plan: string;
  if (product === "bundle") {
    plan = "bundle";
  } else if (product === "gc") {
    plan =
      existing && (existing.plan === "bl" || existing.plan === "bundle")
        ? "bundle"
        : "full";
  } else {
    plan =
      existing && existing.plan !== "bl" ? "bundle" : "bl";
  }

  await db
    .insert(foremanAccess)
    .values({ userId: params.userId, plan, source, expiresAt })
    .onConflictDoUpdate({
      target: foremanAccess.userId,
      set: { plan, source, expiresAt, grantedAt: sql`now()` },
    });
}

// ---- Attempts (practice sessions and mock exams) -----------------

export async function startForemanAttempt(params: {
  userId: string;
  mode: "practice" | "exam";
  domain?: string | null;
}): Promise<string> {
  const rows = await db
    .insert(foremanAttempts)
    .values({
      userId: params.userId,
      mode: params.mode,
      domain: params.domain ?? null,
    })
    .returning({ id: foremanAttempts.id });
  return rows[0].id;
}

export async function finishForemanAttempt(params: {
  attemptId: string;
  userId: string;
  total: number;
  correct: number;
}) {
  await db
    .update(foremanAttempts)
    .set({
      total: params.total,
      correct: params.correct,
      finished: true,
      finishedAt: sql`now()`,
    })
    .where(eq(foremanAttempts.id, params.attemptId));
}

export async function getForemanAttempt(attemptId: string): Promise<ForemanAttempt | null> {
  const rows = await db
    .select()
    .from(foremanAttempts)
    .where(eq(foremanAttempts.id, attemptId));
  return rows[0] ?? null;
}

export async function getForemanAttempts(userId: string, limit = 20): Promise<ForemanAttempt[]> {
  return await db
    .select()
    .from(foremanAttempts)
    .where(eq(foremanAttempts.userId, userId))
    .orderBy(desc(foremanAttempts.startedAt))
    .limit(limit);
}

// ---- Answers (one row per question answered, ever) ---------------

export async function recordForemanAnswer(params: {
  attemptId: string;
  userId: string;
  questionId: string;
  domain: string;
  picked: number;
  isCorrect: boolean;
}) {
  await db
    .insert(foremanAnswers)
    .values(params)
    .onConflictDoNothing();
}

// ---- Readiness (per-domain accuracy across everything) -----------

export type DomainStat = { domain: string; total: number; correct: number };

export async function getForemanDomainStats(userId: string): Promise<DomainStat[]> {
  return await db
    .select({
      domain: foremanAnswers.domain,
      total: sql<number>`count(*)::int`,
      correct: sql<number>`count(*) filter (where ${foremanAnswers.isCorrect})::int`,
    })
    .from(foremanAnswers)
    .where(eq(foremanAnswers.userId, userId))
    .groupBy(foremanAnswers.domain);
}

// ============================================================
// END OF FILE - lib/db/foreman.ts (v3 - bundle purchases grant
// both products in one write)
// If you can see this comment, the paste was not truncated.
// ============================================================
