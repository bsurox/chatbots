"use client";
import Form from "next/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/chat/submit-button";
import { toast } from "@/components/chat/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ResetPasswordState, resetPassword } from "../reset-actions";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [state, formAction] = useActionState<ResetPasswordState, FormData>(
    resetPassword,
    { status: "idle" }
  );

  useEffect(() => {
    if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Password must be at least 6 characters.",
      });
    } else if (state.status === "invalid_token") {
      toast({
        type: "error",
        description: "This reset link is invalid or has expired.",
      });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Something went wrong. Try again." });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      toast({
        type: "success",
        description: "Password updated! Please sign in.",
      });
      setTimeout(() => router.push("/login"), 1500);
    }
  }, [state.status, router]);

  if (!token) {
    return (
      <>
        <h1 className="text-2xl font-semibold tracking-tight">Invalid link</h1>
        <p className="text-sm text-muted-foreground">
          This reset link is missing or broken. Please request a new one.
        </p>
        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/forgot-password"
          >
            Request a new link
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Set a new password
      </h1>
      <p className="text-sm text-muted-foreground">
        Choose a new password for your account.
      </p>

      <Form action={formAction} className="mt-4 flex flex-col gap-4">
        <input name="token" type="hidden" value={token} />
        <div className="flex flex-col gap-2">
          <Label
            className="font-normal text-muted-foreground"
            htmlFor="password"
          >
            New password
          </Label>
          <Input
            autoComplete="new-password"
            autoFocus
            className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
            id="password"
            name="password"
            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            required
            type="password"
          />
        </div>
        <SubmitButton isSuccessful={isSuccessful}>
          Update password
        </SubmitButton>
      </Form>
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground">Loading...</div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
