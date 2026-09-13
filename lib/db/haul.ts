// FILE: lib/db/haul.ts
import "server-only";
import { and, eq, sql } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { db } from "./queries";

// HaulLegal data layer (v2 - TEXT REMINDERS: haul_profiles gains
// phone (E.164, +1XXXXXXXXXX), sms (the owner's current text opt-in)
// and sms_consent_at (when the consent box was first checked - the
// record the carriers expect us to keep). saveHaulProfile leaves
// phone / sms untouched when a caller does not send them (the
// walkthrough page only saves progress). setSmsByPhone flips the
// opt-in for every profile carrying a number - the inbound STOP /
// START webhook and a carrier "unsubscribed" send error use it;
// START only re-enables a number that consented on the web form.
// listReminderCandidates now returns phone / sms / reminders and
// includes owners with either channel on.)
// v1 notes - same pattern as lib/db/foreman.ts: the
// tables are created directly in Postgres via setup SQL (one
// CREATE TABLE IF NOT EXISTS per Prisma Console run), these
// definitions let us query them type-safely, and every helper the
// product needs lives in this one file. DELIBERATELY SEPARATE from
// foreman_access - HaulLegal has a one-time product AND a monthly
// subscription, which the plan-string set was never built for, and
// keeping it here means the exam-prep money files are never
// touched by this island.
//   haul_access          who bought the walkthrough, subscription state
//   haul_profiles        the Stay Legal profile + walkthrough progress
//   haul_reminders_sent  dedupe ledger for the reminder job
// Subscription state comes ONLY from Stripe webhooks: sub_status
// mirrors Stripe's status (trialing / active / past_due / canceled /
// unpaid / none) and current_period_end is the paid-through date.
// hasStayLegal() answers "should reminders and saved calendar work
// right now" - trialing or active, or any status whose paid-through
// date is still in the future (so a cancel-at-period-end customer
// keeps what they paid for).

export const haulAccess = pgTable("haul_access", {
  userId: uuid("user_id").primaryKey(),
  walkthrough: boolean("walkthrough").notNull().default(false),
  subStatus: text("sub_status").notNull().default("none"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const haulProfiles = pgTable("haul_profiles", {
  userId: uuid("user_id").primaryKey(),
  profile: jsonb("profile").notNull().default({}),
  progress: jsonb("progress").notNull().default([]),
  reminders: boolean("reminders").notNull().default(true),
  phone: text("phone"),
  sms: boolean("sms").notNull().default(false),
  smsConsentAt: timestamp("sms_consent_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const haulRemindersSent = pgTable(
  "haul_reminders_sent",
  {
    userId: uuid("user_id").notNull(),
    dueId: text("due_id").notNull(),
    dueDate: date("due_date").notNull(),
    leadDays: integer("lead_days").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.dueId, table.dueDate, table.leadDays] }),
  })
);

export type HaulAccessRow = typeof haulAccess.$inferSelect;
export type HaulProfileRow = typeof haulProfiles.$inferSelect;

export type HaulAccessSummary = {
  walkthrough: boolean;
  sub: boolean;
  subStatus: string;
  periodEnd: Date | null;
  customerId: string | null;
};

const LIVE_STATUSES = new Set(["trialing", "active"]);

function summarize(row: HaulAccessRow | null): HaulAccessSummary {
  if (!row) {
    return { walkthrough: false, sub: false, subStatus: "none", periodEnd: null, customerId: null };
  }
  const paidThrough = row.currentPeriodEnd ? row.currentPeriodEnd.getTime() > Date.now() : false;
  const sub = LIVE_STATUSES.has(row.subStatus) || paidThrough;
  return {
    walkthrough: row.walkthrough,
    sub,
    subStatus: row.subStatus,
    periodEnd: row.currentPeriodEnd ?? null,
    customerId: row.stripeCustomerId ?? null,
  };
}

// ---- Access ---------------------------------------------------------

export async function getHaulAccess(userId: string): Promise<HaulAccessSummary> {
  const rows = await db.select().from(haulAccess).where(eq(haulAccess.userId, userId));
  return summarize(rows[0] ?? null);
}

export async function hasHaulWalkthrough(userId: string): Promise<boolean> {
  return (await getHaulAccess(userId)).walkthrough;
}

export async function hasStayLegal(userId: string): Promise<boolean> {
  return (await getHaulAccess(userId)).sub;
}

// One-time walkthrough purchase. Never downgrades anything; records
// the Stripe customer id when checkout created one so the billing
// portal and later subscriptions attach to the same customer.
export async function grantHaulWalkthrough(params: { userId: string; customerId?: string | null }) {
  const customerId = params.customerId ?? null;
  await db
    .insert(haulAccess)
    .values({ userId: params.userId, walkthrough: true, stripeCustomerId: customerId })
    .onConflictDoUpdate({
      target: haulAccess.userId,
      set: {
        walkthrough: true,
        stripeCustomerId: customerId ? customerId : sql`${haulAccess.stripeCustomerId}`,
        updatedAt: sql`now()`,
      },
    });
}

// Subscription state straight from a Stripe subscription object.
export async function upsertHaulSubscription(params: {
  userId: string;
  customerId: string | null;
  subscriptionId: string | null;
  status: string;
  periodEnd: Date | null;
}) {
  await db
    .insert(haulAccess)
    .values({
      userId: params.userId,
      walkthrough: false,
      subStatus: params.status,
      stripeCustomerId: params.customerId,
      stripeSubscriptionId: params.subscriptionId,
      currentPeriodEnd: params.periodEnd,
    })
    .onConflictDoUpdate({
      target: haulAccess.userId,
      set: {
        subStatus: params.status,
        stripeCustomerId: params.customerId ? params.customerId : sql`${haulAccess.stripeCustomerId}`,
        stripeSubscriptionId: params.subscriptionId ? params.subscriptionId : sql`${haulAccess.stripeSubscriptionId}`,
        currentPeriodEnd: params.periodEnd,
        updatedAt: sql`now()`,
      },
    });
}

// Webhook events after checkout carry the Stripe ids, not our user
// id - these two lookups map them back.
export async function findHaulUserBySubscription(subscriptionId: string): Promise<string | null> {
  const rows = await db
    .select({ userId: haulAccess.userId })
    .from(haulAccess)
    .where(eq(haulAccess.stripeSubscriptionId, subscriptionId));
  return rows[0]?.userId ?? null;
}

export async function findHaulUserByCustomer(customerId: string): Promise<string | null> {
  const rows = await db
    .select({ userId: haulAccess.userId })
    .from(haulAccess)
    .where(eq(haulAccess.stripeCustomerId, customerId));
  return rows[0]?.userId ?? null;
}

// ---- Profiles (Stay Legal calendar + walkthrough progress) ---------

export async function getHaulProfile(userId: string): Promise<HaulProfileRow | null> {
  const rows = await db.select().from(haulProfiles).where(eq(haulProfiles.userId, userId));
  return rows[0] ?? null;
}

// phone / sms undefined = leave what is stored; phone null = clear
// the number (and the opt-in with it). The consent timestamp is set
// the first time sms turns on and kept from then on.
export async function saveHaulProfile(params: {
  userId: string;
  profile: unknown;
  progress: unknown;
  reminders: boolean;
  phone?: string | null;
  sms?: boolean;
}) {
  const sms = params.phone === null ? false : params.sms;
  await db
    .insert(haulProfiles)
    .values({
      userId: params.userId,
      profile: params.profile,
      progress: params.progress,
      reminders: params.reminders,
      phone: params.phone ?? null,
      sms: sms ?? false,
      smsConsentAt: sms ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: haulProfiles.userId,
      set: {
        profile: params.profile,
        progress: params.progress,
        reminders: params.reminders,
        phone: params.phone === undefined ? sql`${haulProfiles.phone}` : params.phone,
        sms: sms === undefined ? sql`${haulProfiles.sms}` : sms,
        smsConsentAt: sms ? sql`coalesce(${haulProfiles.smsConsentAt}, now())` : sql`${haulProfiles.smsConsentAt}`,
        updatedAt: sql`now()`,
      },
    });
}

// Inbound STOP / START (and a carrier "unsubscribed" bounce). START
// only re-enables numbers that consented on the web form. Returns
// how many profiles changed.
export async function setSmsByPhone(phone: string, on: boolean): Promise<number> {
  const rows = await db
    .update(haulProfiles)
    .set({ sms: on, updatedAt: sql`now()` })
    .where(on ? and(eq(haulProfiles.phone, phone), sql`${haulProfiles.smsConsentAt} is not null`) : eq(haulProfiles.phone, phone))
    .returning({ userId: haulProfiles.userId });
  return rows.length;
}

// ---- Reminder job support -----------------------------------------

export type ReminderCandidate = { userId: string; profile: unknown; reminders: boolean; sms: boolean; phone: string | null };

// Everyone with email reminders or text reminders switched on whose
// Stay Legal is live (trialing / active, or paid through a future
// date).
export async function listReminderCandidates(limit = 500): Promise<ReminderCandidate[]> {
  const now = new Date();
  const rows = await db
    .select({
      userId: haulProfiles.userId,
      profile: haulProfiles.profile,
      reminders: haulProfiles.reminders,
      sms: haulProfiles.sms,
      phone: haulProfiles.phone,
    })
    .from(haulProfiles)
    .innerJoin(haulAccess, eq(haulAccess.userId, haulProfiles.userId))
    .where(
      and(
        sql`(${haulProfiles.reminders} = true or ${haulProfiles.sms} = true)`,
        sql`(${haulAccess.subStatus} in ('trialing','active') or ${haulAccess.currentPeriodEnd} > ${now})`
      )
    )
    .limit(limit);
  return rows.map((r) => ({ userId: r.userId, profile: r.profile, reminders: r.reminders, sms: r.sms, phone: r.phone ?? null }));
}

// Returns true only for the first attempt to send a given reminder -
// the primary key makes every later attempt a no-op.
export async function claimReminder(params: { userId: string; dueId: string; dueDate: string; leadDays: number }): Promise<boolean> {
  const rows = await db
    .insert(haulRemindersSent)
    .values({ userId: params.userId, dueId: params.dueId, dueDate: params.dueDate, leadDays: params.leadDays })
    .onConflictDoNothing()
    .returning({ userId: haulRemindersSent.userId });
  return rows.length > 0;
}

// Housekeeping helper for the job: ledger rows older than a year are
// never consulted again.
export async function sweepReminderLedger() {
  await db.delete(haulRemindersSent).where(sql`${haulRemindersSent.sentAt} < now() - interval '400 days'`);
}

// ============================================================
// END OF FILE - lib/db/haul.ts (v2 - phone / sms / sms_consent_at
// on haul_profiles, setSmsByPhone; haul_access / haul_profiles /
// haul_reminders_sent definitions and helpers)
// If you can see this comment, the paste was not truncated.
// ============================================================
