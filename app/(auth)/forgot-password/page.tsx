"use client";
import Form from "next/form";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/chat/submit-button";
import { toast } from "@/components/chat/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ForgotPasswordState,
  requestPasswordReset,
} from "../reset-actions";

export default function Page() {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [state, formAction] = useActionState<ForgotPasswordState, FormData>(
    requestPasswordReset,
    { status: "idle" }
  );

  useEffect(() => {
    if (state.status === "invalid_data") {
      toast({ type: "error", description: "Please enter a valid email." });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Something went wrong. Try again." });
    } else if (state.status === "success") {
      setIsSuccessful(true);
    }
  }, [state.status]);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Reset password
      </h1>
      <p className="text-sm text-muted-foreground">
        Enter your email and we'll send you a reset link.
      </p>

      {isSuccessful ? (
        <div className="mt-4 rounded-lg border border-border/50 bg-muted/40 p-4 text-sm text-muted-foreground">
          If an account exists for that email, a reset link is on its way. Check
          your inbox.
        </div>
      ) : (
        <Form action={formAction} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label
              className="font-normal text-muted-foreground"
              htmlFor="email"
            >
              Email
            </Label>
            <Input
              autoComplete="email"
              autoFocus
              className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
              id="email"
              name="email"
              placeholder="you@someo.ne"
              required
              type="email"
            />
          </div>
          <SubmitButton isSuccessful={isSuccessful}>
            Send reset link
          </SubmitButton>
        </Form>
      )}

      <p className="mt-4 text-center text-[13px] text-muted-foreground">
        {"Remembered it? "}
        <Link
          className="text-foreground underline-offset-4 hover:underline"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
