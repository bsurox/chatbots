import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "./queries";
import { userCredits } from "./schema";

export const FREE_DAILY_MESSAGES = 10;
const FREE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ChatSpendResult = { source: "free" | "credit" | "blocked"; freeRemaining: number; credits: number };
export type FreeStatus = { freeRemaining: number; credits: number };

export async function getUserCredits(userId: string): Promise<number> {
  const result = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId));
  if (result.length === 0) {
    await db.insert(userCredits).values({ userId, credits: 0 });
    return 0;
  }
  return result[0].credits;
}

export async function addCredits(userId: string, amount: number) {
  const existing = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId));
  if (existing.length === 0) {
    await db.insert(userCredits).values({ userId, credits: amount });
  } else {
    await db
      .update(userCredits)
      .set({
        credits: sql`${userCredits.credits} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, userId));
  }
}

export async function deductCredits(
  userId: string,
  amount: number,
): Promise<boolean> {
  const current = await getUserCredits(userId);
  if (current < amount) {
    return false;
  }
  await db
    .update(userCredits)
    .set({
      credits: sql`${userCredits.credits} - ${amount}`,
      updatedAt: new Date(),
    })
    .where(eq(userCredits.userId, userId));
  return true;
}

type RawCreditRow = { credits: number | string; free_messages_used: number | string; free_last_used: Date | string | null };

async function readCreditRow(userId: string): Promise<RawCreditRow> {
  await getUserCredits(userId);
  const res = await db.execute(sql`SELECT "credits", free_messages_used, free_last_used FROM "UserCredits" WHERE "userId" = ${userId}`);
  const rows = (Array.isArray(res) ? res : (res as unknown as { rows: RawCreditRow[] }).rows) as RawCreditRow[];
  return rows[0];
}

// Spends one chat message: free allowance first, then paid credits.
// The 24h free window runs from the most recent free message sent.
export async function spendChatMessage(userId: string): Promise<ChatSpendResult> {
  const row = await readCreditRow(userId);
  const creditsNow = Number(row.credits);
  const lastMs = row.free_last_used ? new Date(row.free_last_used).getTime() : null;
  const expired = lastMs === null || Date.now() - lastMs >= FREE_WINDOW_MS;
  const usedSoFar = expired ? 0 : Number(row.free_messages_used);
  if (usedSoFar < FREE_DAILY_MESSAGES) {
    const newUsed = usedSoFar + 1;
    await db.execute(sql`UPDATE "UserCredits" SET free_messages_used = ${newUsed}, free_last_used = NOW(), "updatedAt" = NOW() WHERE "userId" = ${userId}`);
    return { source: "free", freeRemaining: FREE_DAILY_MESSAGES - newUsed, credits: creditsNow };
  }
  if (creditsNow >= 1) {
    const ok = await deductCredits(userId, 1);
    if (ok) {
      return { source: "credit", freeRemaining: 0, credits: creditsNow - 1 };
    }
  }
  return { source: "blocked", freeRemaining: 0, credits: creditsNow };
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
// END OF FILE - lib/db/credits.ts (v2 - free chat tier)
// If you can see this comment, the paste was not truncated.
// ============================================================
