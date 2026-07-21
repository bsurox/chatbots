import { ArrowLeftIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { GemIcon } from "@/components/chat/gem-icon";
import { Preview } from "@/components/chat/preview";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Spotmint face (v4): when this door is reached from a Spotmint
  // surface - the spotmint.store host or the wrapped app's signature -
  // the auth screens wear Spotmint branding with AskEvo LLC in fine
  // print. askevo.ai itself keeps the original look untouched.
  const h = await headers();
  const host = h.get("host") ?? "";
  const ua = h.get("user-agent") ?? "";
  const isSpotmint = host.includes("spotmint.store") || ua.includes("SpotmintApp");
  return (
    <div className="flex h-dvh w-screen bg-sidebar">
      <div className={isSpotmint ? "flex w-full flex-col bg-background p-8 md:p-16" : "flex w-full flex-col bg-background p-8 xl:w-[600px] xl:shrink-0 xl:rounded-r-2xl xl:border-r xl:border-border/40 md:p-16"}>
        <Link
          className="flex w-fit items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-10">
          <div className="flex flex-col gap-2">
            {isSpotmint ? (
              <div className="mb-2 font-extrabold text-white text-xl tracking-tight">
                Spot<span style={{ color: "#22c55e" }}>mint</span>
              </div>
            ) : (
              <div
                className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/50"
                style={{ color: "#f59e0b" }}
              >
                <GemIcon className="size-3.5" />
              </div>
            )}
            {children}
            {isSpotmint && (
              <p className="mt-6 text-center text-[11px] text-muted-foreground">
                Powered by AskEvo LLC
              </p>
            )}
          </div>
        </div>
      </div>
      {!isSpotmint && (
        <div className="hidden flex-1 flex-col overflow-hidden pl-12 xl:flex">
          <div className="flex-1 pt-4">
            <Preview />
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/(auth)/layout.tsx (v4 - spotmint face)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
