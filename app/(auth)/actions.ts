"use server";
import { z } from "zod";
import { addCredits } from "@/lib/db/credits";
import { createUser, getUser } from "@/lib/db/queries";
import { claimPromoCredits } from "@/lib/db/waitlist";
import { signIn } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type LoginActionState = {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    return { status: "failed" };
  }
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
};

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = registerFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    });
    const [user] = await getUser(validatedData.email);
    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }
    const fullName = `${validatedData.firstName} ${validatedData.lastName}`.trim();
    await createUser(validatedData.email, validatedData.password, fullName);

    // Grant any promo credits attached to this email (e.g. AdReel
    // free video offer). claimPromoCredits flips the claimed flag
    // exactly once, so this can never double-grant. Wrapped so a
    // promo failure can never block account creation.
    try {
      const [newUser] = await getUser(validatedData.email);
      if (newUser) {
        const promo = await claimPromoCredits(validatedData.email);
        if (promo > 0) {
          await addCredits(newUser.id, promo);
        }
      }
    } catch (promoError) {
      console.error("Promo claim error:", promoError);
    }

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });
    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    return { status: "failed" };
  }
};

// ============================================================
// END OF FILE - app/(auth)/actions.ts (v2 - promo claim)
// If you can see this comment, the paste was not truncated.
// ============================================================
