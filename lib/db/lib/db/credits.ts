import { db } from './queries';
import { userCredits } from './schema';
import { eq, sql } from 'drizzle-orm';

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
      .set({ credits: sql`${userCredits.credits} + ${amount}`, updatedAt: new Date() })
      .where(eq(userCredits.userId, userId));
  }
}

export async function deductCredits(userId: string, amount: number): Promise<boolean> {
  const current = await getUserCredits(userId);

  if (current < amount) {
    return false;
  }

  await db
    .update(userCredits)
    .set({ credits: sql`${userCredits.credits} - ${amount}`, updatedAt: new Date() })
    .where(eq(userCredits.userId, userId));

  return true;
}
