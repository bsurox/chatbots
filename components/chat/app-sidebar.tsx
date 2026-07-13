"use client";

import {
  ImageIcon,
  LifeBuoyIcon,
  MicIcon,
  PanelLeftIcon,
  PlusIcon,
  EarIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "next-auth";
import useSWR from "swr";
import { GemIcon } from "./gem-icon";
import { SidebarHistory } from "@/components/chat/sidebar-history";
import { SidebarUserNav } from "@/components/chat/sidebar-user-nav";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { fetcher } from "@/lib/utils";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile, toggleSidebar } = useSidebar();

  const { data: creditsData } = useSWR(
    user ? "/api/credits" : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const credits = creditsData?.credits ?? 0;

  const isActive = (path: string) => pathname === path;

  const navButtonClass = (active: boolean) =>
    active
      ? "h-8 rounded-md bg-sidebar-accent text-[13px] text-sidebar-foreground transition-colors duration-150"
      : "h-8 rounded-md text-[13px] text-sidebar-foreground/70 transition-colors duration-150 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground";

  const creditsButtonClass = (active: boolean) =>
    active
      ? "h-9 rounded-md border border-amber-500/70 bg-amber-500/25 text-[13px] font-semibold text-amber-400 transition-all duration-150"
      : "h-9 rounded-md border border-amber-500/40 bg-amber-500/15 text-[13px] font-semibold text-amber-400 transition-all duration-150 hover:border-amber-500/60 hover:bg-amber-500/25";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pb-0 pt-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-between">
            <div className="group/logo relative flex items-center justify-center">
              <SidebarMenuButton asChild className="size-8 !px-0 items-center justify-center group-data-[collapsible=icon]:group-hover/logo:opacity-0" tooltip="AskEvo">
                <Link href="/" onClick={() => setOpenMobile(false)}>
                  <div className="flex size-7 items-center justify-center border border-primary bg-background text-[11px] font-semibold text-primary" style={{ borderRadius: 8 }}>AE</div>
                </Link>
              </SidebarMenuButton>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton className="pointer-events-none absolute inset-0 size-8 opacity-0 group-data-[collapsible=icon]:pointer-events-auto group-data-[collapsible=icon]:group-hover/logo:opacity-100" onClick={() => toggleSidebar()}>
                    <PanelLeftIcon className="size-4" />
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent className="hidden md:block" side="right">Open sidebar</TooltipContent>
              </Tooltip>
            </div>
            <span className="ml-2 flex-1 text-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">AskEvo</span>
            <div className="group-data-[collapsible=icon]:hidden">
              <SidebarTrigger className="text-sidebar-foreground/60 transition-colors duration-150 hover:text-sidebar-foreground" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-1">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={navButtonClass(isActive("/"))}
                  onClick={() => { setOpenMobile(false); router.push("/"); }}
                  tooltip="New chat"
                >
                  <PlusIcon className="size-4 text-primary" />
                  <span className="font-medium">New chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/image"))} tooltip="Image">
                  <Link href="/image" onClick={() => setOpenMobile(false)}>
                    <ImageIcon className="size-4" />
                    <span className="font-medium">Image</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/video"))} tooltip="Video">
                  <Link href="/video" onClick={() => setOpenMobile(false)}>
                    <VideoIcon className="size-4" />
                    <span className="font-medium">Video</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/voice"))} tooltip="Voice">
                  <Link href="/voice" onClick={() => setOpenMobile(false)}>
                    <MicIcon className="size-4" />
                    <span className="font-medium">Voice</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/transcribe"))} tooltip="Speech to text">
                  <Link href="/transcribe" onClick={() => setOpenMobile(false)}>
                    <EarIcon className="size-4" />
                    <span className="font-medium">Speech to text</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="mt-0.5 mb-1">
                <SidebarMenuButton asChild className={creditsButtonClass(isActive("/credits"))} tooltip="Buy credits">
                  <Link href="/credits" onClick={() => setOpenMobile(false)}>
                    <GemIcon className="size-4 text-amber-400" />
                    <span className="text-amber-400">Buy credits</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/support"))} tooltip="Support">
                  <Link href="/support" onClick={() => setOpenMobile(false)}>
                    <LifeBuoyIcon className="size-4" />
                    <span className="font-medium">Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter className="pt-2 pb-2">
        {user && (
          <div className="mx-2 flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 group-data-[collapsible=icon]:hidden">
            <GemIcon className="size-4 text-amber-400" />
            <span className={creditsData && credits <= 20 ? "text-[13px] font-semibold text-red-400" : "text-[13px] font-semibold text-green-500"}>
              {creditsData ? credits.toLocaleString() : "..."}
            </span>
            <span className="text-xs text-sidebar-foreground/60">credits</span>
          </div>
        )}
        {user && <SidebarUserNav user={user} />}
        <div className="px-3 pb-1 text-[11px] text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
          <Link className="hover:text-sidebar-foreground/80 hover:underline" href="/privacy" target="_blank">Privacy Policy</Link>
          <span className="px-1.5">|</span>
          <Link className="hover:text-sidebar-foreground/80 hover:underline" href="/terms" target="_blank">Terms</Link>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// -----------------------------------------------------------
// END OF FILE - components/chat/app-sidebar.tsx (v6 - icon polish)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
