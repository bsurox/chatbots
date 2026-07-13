import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.askevo.ai"),
  title: "AskEvo",
  description: "AI-powered chat, image generation, and voice tools.",
};
export const viewport = {
  maximumScale: 1,
};
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});
const DARK_THEME_COLOR = "#101617";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', '${DARK_THEME_COLOR}');
})();`;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} ${geistMono.variable} dark`}
      lang="en"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
    <head>
        <link href="/ae-icon.svg" rel="icon" type="image/svg+xml" />
        <link href="/logo.png" rel="icon" type="image/png" />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required"
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SessionProvider
            basePath={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/auth`}
          >
            <TooltipProvider>{children}</TooltipProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/layout.tsx (v2 - Inter font)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
