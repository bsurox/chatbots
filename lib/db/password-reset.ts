import "server-only";

import { and, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { passwordResetToken, user } from "./schema";
import { generateHashedPassword } from "./utils";

const client = postgres(process.env.POSTGRES_URL ?? "");
const db = drizzle(client);

export async function createPasswordResetToken(
  userId: string,
  token: string,
  expiresAt: Date
) {
  return await db.insert(passwordResetToken).values({
    userId,
    token,
    expiresAt,
    used: false,
  });
}

export async function getValidResetToken(token: string) {
  const [row] = await db
    .select()
    .from(passwordResetToken)
    .where(
      and(
        eq(passwordResetToken.token, token),
        eq(passwordResetToken.used, false),
        gt(passwordResetToken.expiresAt, new Date())
      )
    )
    .limit(1);
  return row ?? null;
}

export async function markTokenUsed(token: string) {
  return await db
    .update(passwordResetToken)
    .set({ used: true })
    .where(eq(passwordResetToken.token, token));
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const hashed = generateHashedPassword(newPassword);
  return await db
    .update(user)
    .set({ password: hashed })
    .where(eq(user.id, userId));
}
