// FILE: app/(auth)/login/page.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { AuthForm } from "@/components/chat/auth-form";
import { SubmitButton } from "@/components/chat/submit-button";
import { toast } from "@/components/chat/toast";
import { type LoginActionState, login } from "../actions";

// v3: brand-aware landing after sign-in. The old success path
// just refreshed, and the site proxy then bounced every fresh
// session off /login to "/" - which on foremanprep.com is ALWAYS
// the orange landing, even for someone who came from a Business
// & Law page. Now a ForemanPrep login is sent where its brand
// says: B&L logins (?brand=bl in the URL, or the sessionStorage
// value the auth layout keeps alive across the login/register/
// forgot-password hops) land on /bl-prep, plain ForemanPrep
// logins land on "/" (the orange landing, same place as before).
// On every other host (AskEvo, Spotmint) the helper returns null
// and the original refresh flow runs exactly as it always did.
function foremanDestination(): string | null {
  if (!window.location.hostname.includes("foremanprep.com")) return null;
  let bl = new URLSearchParams(window.location.search).get("brand") === "bl";
  if (!bl) {
    try {
      bl = window.sessionStorage.getItem("fp-auth-brand") === "bl";
    } catch {
      // Storage blocked - fall through to the plain landing.
    }
  }
  return bl ? "/bl-prep" : "/";
}

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );
  const { update: updateSession } = useSession();
  // biome-ignore lint/correctness/useExhaustiveDependencies: router and updateSession are stable refs
  useEffect(() => {
    if (state.status === "failed") {
      toast({ type: "error", description: "Invalid credentials!" });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      updateSession();
      const dest = foremanDestination();
      if (dest) {
        router.push(dest);
      } else {
        router.refresh();
      }
    }
  }, [state.status]);
  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted-foreground">
        Sign in to your account to continue
      </p>
      <AuthForm action={handleSubmit} defaultEmail={email}>
        <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
        <div className="text-center">
          <Link
            className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <p className="text-center text-[13px] text-muted-foreground">
          {"No account? "}
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/register"
          >
            Sign up
          </Link>
        </p>
      </AuthForm>
      <p className="pt-2 text-center text-[11px] text-muted-foreground/60">
        <Link className="underline-offset-2 hover:underline" href="/privacy" target="_blank">
          Privacy Policy
        </Link>
        <span className="px-1.5">|</span>
        <Link className="underline-offset-2 hover:underline" href="/terms" target="_blank">
          Terms of Service
        </Link>
      </p>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/(auth)/login/page.tsx (v3 - brand-aware
// landing: B&L logins go to /bl-prep, ForemanPrep to "/")
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
