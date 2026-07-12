import "server-only";
import { and, count, eq, gt } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { db } from "./queries";

export const waitlistSignups = pgTable("waitlist_signups", {
  email: text("email").primaryKey(),
  business: text("business"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  promoCredits: integer("promo_credits").notNull().default(0),
  promoClaimed: boolean("promo_claimed").notNull().default(false),
  ip: varchar("ip", { length: 64 }),
});

export async function addToWaitlist(params: {
  email: string;
  business?: string | null;
  source?: string | null;
  promoCredits?: number;
  ip?: string | null;
}) {
  await db
    .insert(waitlistSignups)
    .values({
      email: params.email.toLowerCase().trim(),
      business: params.business ?? null,
      source: params.source ?? null,
      promoCredits: params.promoCredits ?? 0,
      ip: params.ip ?? null,
    })
    .onConflictDoNothing();
}

// Counts how many signups from this IP received promo credits in the
// last N hours. Used to cap free-credit grants per IP. Withheld
// (zero-credit) signups do not count toward the cap.
export async function countRecentPromoSignups(ip: string, hours: number): Promise<number> {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  const rows = await db
    .select({ value: count() })
    .from(waitlistSignups)
    .where(
      and(
        eq(waitlistSignups.ip, ip),
        gt(waitlistSignups.promoCredits, 0),
        gt(waitlistSignups.createdAt, cutoff)
      )
    );
  return rows[0] ? rows[0].value : 0;
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
// END OF FILE - lib/db/waitlist.ts (v2 - IP tracking)
// If you can see this comment, the paste was not truncated.
// ============================================================
