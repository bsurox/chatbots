"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Form from "next/form";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type AuthFormProps = {
  action: string | ((formData: FormData) => void | Promise<void>);
  children: React.ReactNode;
  defaultEmail?: string;
  showNameFields?: boolean;
  showConfirmPassword?: boolean;
};

function PasswordField({
  autoComplete,
  id,
  label,
  name,
}: {
  autoComplete?: string;
  id: string;
  label: string;
  name: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-normal text-muted-foreground" htmlFor={id}>
        {label}
      </Label>
      <div className="relative">
        <Input
          autoComplete={autoComplete}
          className="h-10 rounded-lg border-border/50 bg-muted/50 pr-10 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
          id={id}
          name={name}
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
          type={show ? "text" : "password"}
        />
        <button
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground/60 transition-colors hover:text-foreground"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          type="button"
        >
          {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function AuthForm({
  action,
  children,
  defaultEmail = "",
  showNameFields = false,
  showConfirmPassword = false,
}: AuthFormProps) {
  return (
    <Form action={action} className="flex flex-col gap-4">
      {showNameFields && (
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <Label
              className="font-normal text-muted-foreground"
              htmlFor="firstName"
            >
              First name
            </Label>
            <Input
              autoComplete="given-name"
              autoFocus
              className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
              id="firstName"
              name="firstName"
              placeholder="Jane"
              required
              type="text"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label
              className="font-normal text-muted-foreground"
              htmlFor="lastName"
            >
              Last name
            </Label>
            <Input
              autoComplete="family-name"
              className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              type="text"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label className="font-normal text-muted-foreground" htmlFor="email">
          Email
        </Label>
        <Input
          autoComplete="email"
          autoFocus={!showNameFields}
          className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
          defaultValue={defaultEmail}
          id="email"
          name="email"
          placeholder="you@someo.ne"
          required
          type="email"
        />
      </div>
      <PasswordField id="password" label="Password" name="password" />
      {showConfirmPassword && (
        <PasswordField
          autoComplete="new-password"
          id="confirmPassword"
          label="Confirm password"
          name="confirmPassword"
        />
      )}
      {children}
    </Form>
  );
}

// -----------------------------------------------------------
// END OF FILE - components/chat/auth-form.tsx (v2 - eye toggle)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
