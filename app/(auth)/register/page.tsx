"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useActionState, useEffect, useState } from "react";
import { AuthForm } from "@/components/chat/auth-form";
import { SubmitButton } from "@/components/chat/submit-button";
import { toast } from "@/components/chat/toast";
import { type RegisterActionState, register } from "../actions";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promo = searchParams.get("promo");
  const promoEmail = searchParams.get("email") || "";
  const isAdreelPromo = promo === "adreel";
  const [email, setEmail] = useState(promoEmail);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    { status: "idle" }
  );
  const { update: updateSession } = useSession();
  // biome-ignore lint/correctness/useExhaustiveDependencies: router and updateSession are stable refs
  useEffect(() => {
    if (state.status === "user_exists") {
      toast({ type: "error", description: "Account already exists!" });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Failed to create account!" });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      toast({ type: "success", description: "Account created!" });
      setIsSuccessful(true);
      updateSession();
      if (isAdreelPromo) {
        window.location.href = "/video?tier=premium&duration=5";
      } else {
        router.refresh();
      }
    }
  }, [state.status]);
  const handleSubmit = (formData: FormData) => {
    if (!agreed) {
      toast({
        type: "error",
        description: "Please agree to the Terms of Service to continue.",
      });
      return;
    }
    setEmail(formData.get("email") as string);
    formAction(formData);
  };
  return (
    <>
      {isAdreelPromo ? (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm">
          <p className="font-semibold text-green-600 dark:text-green-400">
            Your 250 free video credits are waiting
          </p>
          <p className="mt-1 text-muted-foreground">
            Create your account with the same email you just entered and
            your credits are applied instantly.
          </p>
        </div>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
      <p className="text-sm text-muted-foreground">Get started for free</p>
      <AuthForm action={handleSubmit} defaultEmail={email} showNameFields>
        <label className="flex items-start gap-2 text-[13px] text-muted-foreground">
          <input
            checked={agreed}
            className="mt-0.5 size-4 accent-green-500"
            onChange={(e) => setAgreed(e.target.checked)}
            required
            type="checkbox"
          />
          <span>
            I agree to the{" "}
            <Link
              className="text-foreground underline-offset-4 hover:underline"
              href="/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="text-foreground underline-offset-4 hover:underline"
              href="/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        <SubmitButton isSuccessful={isSuccessful}>Sign up</SubmitButton>
        <p className="text-center text-[13px] text-muted-foreground">
          {"Have an account? "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </AuthForm>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/(auth)/register/page.tsx (v3 - hard nav)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
