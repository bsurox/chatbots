import "server-only";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { db } from "./queries";

export const waitlistSignups = pgTable("waitlist_signups", {
  email: text("email").primaryKey(),
  business: text("business"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export async function addToWaitlist(params: {
  email: string;
  business?: string | null;
  source?: string | null;
}) {
  await db
    .insert(waitlistSignups)
    .values({
      email: params.email.toLowerCase().trim(),
      business: params.business ?? null,
      source: params.source ?? null,
    })
    .onConflictDoNothing();
}
