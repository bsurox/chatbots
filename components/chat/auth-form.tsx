import Form from "next/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type AuthFormProps = {
  action: string | ((formData: FormData) => void | Promise<void>);
  children: React.ReactNode;
  defaultEmail?: string;
  showNameFields?: boolean;
};

export function AuthForm({
  action,
  children,
  defaultEmail = "",
  showNameFields = false,
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
      <div className="flex flex-col gap-2">
        <Label className="font-normal text-muted-foreground" htmlFor="password">
          Password
        </Label>
        <Input
          className="h-10 rounded-lg border-border/50 bg-muted/50 text-sm transition-colors focus:border-foreground/20 focus:bg-muted"
          id="password"
          name="password"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
          type="password"
        />
      </div>
      {children}
    </Form>
  );
}
