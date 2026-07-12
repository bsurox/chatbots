import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { db } from "./queries";

export const waitlistSignups = pgTable("waitlist_signups", {
  email: text("email").primaryKey(),
  business: text("business"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  promoCredits: integer("promo_credits").notNull().default(0),
  promoClaimed: boolean("promo_claimed").notNull().default(false),
});

export async function addToWaitlist(params: {
  email: string;
  business?: string | null;
  source?: string | null;
  promoCredits?: number;
}) {
  await db
    .insert(waitlistSignups)
    .values({
      email: params.email.toLowerCase().trim(),
      business: params.business ?? null,
      source: params.source ?? null,
      promoCredits: params.promoCredits ?? 0,
    })
    .onConflictDoNothing();
}

// Atomically claims promo credits for an email. Flips promo_claimed
// from false to true exactly once and returns the credit amount.
// Returns 0 if there is nothing to claim (no matching row, already
// claimed, or no promo credits attached to the signup).
export async function claimPromoCredits(email: string): Promise<number> {
  const rows = await db
    .update(waitlistSignups)
    .set({ promoClaimed: true })
    .where(
      and(
        eq(waitlistSignups.email, email.toLowerCase().trim()),
        eq(waitlistSignups.promoClaimed, false),
        gt(waitlistSignups.promoCredits, 0)
      )
    )
    .returning({ promoCredits: waitlistSignups.promoCredits });
  if (rows.length === 0) {
    return 0;
  }
  return rows[0].promoCredits;
}

// ============================================================
// END OF FILE - lib/db/waitlist.ts
// If you can see this comment, the paste was not truncated.
// ============================================================
