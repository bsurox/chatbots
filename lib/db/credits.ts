import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "./queries";
import { userCredits } from "./schema";

export const FREE_DAILY_MESSAGES = 10;
const FREE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ChatSpendResult = { source: "free" | "credit" | "blocked"; freeRemaining: number; credits: number };
export type FreeStatus = { freeRemaining: number; credits: number };

type SqlRow = Record<string, unknown>;

function normalizeRows(res: unknown): SqlRow[] {
  return (Array.isArray(res) ? res : (res as { rows: SqlRow[] }).rows) as SqlRow[];
}

async function ensureCreditRow(userId: string) {
  await db.insert(userCredits).values({ userId, credits: 0 }).onConflictDoNothing();
}

export async function getUserCredits(userId: string): Promise<number> {
  const result = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId));
  if (result.length === 0) {
    await ensureCreditRow(userId);
    const retry = await db
      .select()
      .from(userCredits)
      .where(eq(userCredits.userId, userId));
    return retry.length > 0 ? retry[0].credits : 0;
  }
  return result[0].credits;
}

// Single-statement upsert: safe under concurrent grants and refunds.
export async function addCredits(userId: string, amount: number) {
  await db
    .insert(userCredits)
    .values({ userId, credits: amount })
    .onConflictDoUpdate({
      target: userCredits.userId,
      set: {
        credits: sql`${userCredits.credits} + ${amount}`,
        updatedAt: new Date(),
      },
    });
}

// Atomic conditional deduct: the balance check and the decrement happen in
// one statement, so two simultaneous requests can never both pass the check
// and drive a balance negative. Returns false when credits are insufficient.
export async function deductCredits(
  userId: string,
  amount: number,
): Promise<boolean> {
  if (amount <= 0) {
    return true;
  }
  const res = await db.execute(sql`UPDATE "UserCredits" SET "credits" = "credits" - ${amount}, "updatedAt" = NOW() WHERE "userId" = ${userId} AND "credits" >= ${amount} RETURNING "credits"`);
  return normalizeRows(res).length > 0;
}

type RawCreditRow = { credits: number | string; free_messages_used: number | string; free_last_used: Date | string | null };

async function readCreditRow(userId: string): Promise<RawCreditRow> {
  await ensureCreditRow(userId);
  const res = await db.execute(sql`SELECT "credits", free_messages_used, free_last_used FROM "UserCredits" WHERE "userId" = ${userId}`);
  return normalizeRows(res)[0] as RawCreditRow;
}

// Spends one chat message: free allowance first, then paid credits.
// The 24h free window runs from the most recent free message sent.
// Both spends are single conditional statements, so concurrent messages
// serialize correctly instead of double-counting.
export async function spendChatMessage(userId: string): Promise<ChatSpendResult> {
  await ensureCreditRow(userId);
  const freeRes = await db.execute(sql`UPDATE "UserCredits" SET free_messages_used = CASE WHEN free_last_used IS NULL OR free_last_used <= NOW() - INTERVAL '24 hours' THEN 1 ELSE free_messages_used + 1 END, free_last_used = NOW(), "updatedAt" = NOW() WHERE "userId" = ${userId} AND (free_last_used IS NULL OR free_last_used <= NOW() - INTERVAL '24 hours' OR free_messages_used < ${FREE_DAILY_MESSAGES}) RETURNING free_messages_used, "credits"`);
  const freeRows = normalizeRows(freeRes);
  if (freeRows.length > 0) {
    const used = Number(freeRows[0].free_messages_used);
    return { source: "free", freeRemaining: Math.max(0, FREE_DAILY_MESSAGES - used), credits: Number(freeRows[0].credits) };
  }
  const paidRes = await db.execute(sql`UPDATE "UserCredits" SET "credits" = "credits" - 1, "updatedAt" = NOW() WHERE "userId" = ${userId} AND "credits" >= 1 RETURNING "credits"`);
  const paidRows = normalizeRows(paidRes);
  if (paidRows.length > 0) {
    return { source: "credit", freeRemaining: 0, credits: Number(paidRows[0].credits) };
  }
  const credits = await getUserCredits(userId);
  return { source: "blocked", freeRemaining: 0, credits };
}

// Read-only view for the header badge.
export async function getFreeStatus(userId: string): Promise<FreeStatus> {
  const row = await readCreditRow(userId);
  const lastMs = row.free_last_used ? new Date(row.free_last_used).getTime() : null;
  const expired = lastMs === null || Date.now() - lastMs >= FREE_WINDOW_MS;
  const used = expired ? 0 : Number(row.free_messages_used);
  const freeRemaining = Math.max(0, FREE_DAILY_MESSAGES - used);
  return { freeRemaining, credits: Number(row.credits) };
}

// ============================================================
// END OF FILE - lib/db/credits.ts (v3 - atomic spends)
// If you can see this comment, the paste was not truncated.
// ============================================================
