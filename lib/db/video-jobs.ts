import "server-only";
import { and, eq } from "drizzle-orm";
import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { db } from "./queries";

// This table is created directly in Postgres via the setup SQL, so it does not
// need a Drizzle migration. This definition just lets us query it type-safely.
export const videoJobs = pgTable("video_jobs", {
  requestId: text("request_id").primaryKey(),
  userId: text("user_id").notNull(),
  creditCost: integer("credit_cost").notNull(),
  status: text("status").notNull().default("pending"),
  refunded: boolean("refunded").notNull().default(false),
  statusUrl: text("status_url"),
  responseUrl: text("response_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type VideoJob = typeof videoJobs.$inferSelect;

export async function createVideoJob(params: {
  requestId: string;
  userId: string;
  creditCost: number;
  statusUrl?: string | null;
  responseUrl?: string | null;
}) {
  await db.insert(videoJobs).values({
    requestId: params.requestId,
    userId: params.userId,
    creditCost: params.creditCost,
    status: "processing",
    statusUrl: params.statusUrl ?? null,
    responseUrl: params.responseUrl ?? null,
  });
}

export async function getVideoJob(requestId: string): Promise<VideoJob | null> {
  const rows = await db
    .select()
    .from(videoJobs)
    .where(eq(videoJobs.requestId, requestId));
  return rows[0] ?? null;
}

export async function markVideoJobCompleted(requestId: string) {
  await db
    .update(videoJobs)
    .set({ status: "completed" })
    .where(eq(videoJobs.requestId, requestId));
}

// Atomically flips refunded from false -> true. Returns the job row ONLY to the
// caller that won the flip (the one responsible for issuing the refund).
// Returns null if it was already refunded, which prevents double-refunds.
export async function claimVideoJobRefund(
  requestId: string
): Promise<VideoJob | null> {
  const rows = await db
    .update(videoJobs)
    .set({ status: "failed", refunded: true })
    .where(and(eq(videoJobs.requestId, requestId), eq(videoJobs.refunded, false)))
    .returning();
  return rows[0] ?? null;
}
