import "server-only";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export async function sendResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: "AskEvo <noreply@askevo.ai>",
    to,
    subject: "Reset your AskEvo password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #111;">
        <h1 style="font-size: 22px; margin-bottom: 12px;">Reset your password</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #444;">
          We received a request to reset your AskEvo password. Click the button below to choose a new one. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 24px; background: #22c55e; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Reset Password
        </a>
        <p style="font-size: 13px; color: #888; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });
}
