"use client";
import Form from "next/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { PasswordField } from "@/components/chat/auth-form";
import { SubmitButton } from "@/components/chat/submit-button";
import { toast } from "@/components/chat/toast";
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
  const handleSubmit = (formData: FormData) => {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      toast({
        type: "error",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }
    formAction(formData);
  };
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
      <Form action={handleSubmit} className="mt-4 flex flex-col gap-4">
        <input name="token" type="hidden" value={token} />
        <PasswordField
          autoComplete="new-password"
          autoFocus
          id="password"
          label="New password"
          name="password"
        />
        <PasswordField
          autoComplete="new-password"
          id="confirmPassword"
          label="Confirm new password"
          name="confirmPassword"
        />
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

// -----------------------------------------------------------
// END OF FILE - app/(auth)/reset-password/page.tsx (v2)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
