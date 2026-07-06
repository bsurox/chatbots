"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { getUser } from "@/lib/db/queries";
import {
  createPasswordResetToken,
  getValidResetToken,
  markTokenUsed,
  updateUserPassword,
} from "@/lib/db/password-reset";
import { sendResetEmail } from "@/lib/email/send-reset-email";

const emailSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export type ForgotPasswordState = {
  status: "idle" | "success" | "invalid_data" | "failed";
};

export const requestPasswordReset = async (
  _: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> => {
  try {
    const { email } = emailSchema.parse({
      email: formData.get("email"),
    });

    const [foundUser] = await getUser(email);

    // Only actually send if the user exists — but always report success
    // so we don't reveal which emails have accounts.
    if (foundUser) {
      const token = randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await createPasswordResetToken(foundUser.id, token, expiresAt);

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? "https://www.askevo.ai";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;
      await sendResetEmail(email, resetUrl);
    }

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    return { status: "failed" };
  }
};

export type ResetPasswordState = {
  status: "idle" | "success" | "invalid_data" | "invalid_token" | "failed";
};

export const resetPassword = async (
  _: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> => {
  try {
    const { token, password } = resetSchema.parse({
      token: formData.get("token"),
      password: formData.get("password"),
    });

    const validToken = await getValidResetToken(token);
    if (!validToken) {
      return { status: "invalid_token" };
    }

    await updateUserPassword(validToken.userId, password);
    await markTokenUsed(token);

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    return { status: "failed" };
  }
};
