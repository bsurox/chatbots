"use client";

import {
  ImageIcon,
  LifeBuoyIcon,
  MicIcon,
  PanelLeftIcon,
  PenSquareIcon,
  SparklesIcon,
  FileAudioIcon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "next-auth";
import useSWR from "swr";
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
      ? "h-8 rounded-lg border border-sidebar-border bg-sidebar-accent text-[13px] text-sidebar-foreground transition-colors duration-150"
      : "h-8 rounded-lg border border-sidebar-border text-[13px] text-sidebar-foreground/70 transition-colors duration-150 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground";

  const creditsButtonClass = (active: boolean) =>
    active
      ? "h-9 rounded-lg border border-amber-500/50 bg-gradient-to-r from-amber-500/30 via-amber-400/25 to-amber-500/30 text-[13px] font-semibold text-amber-600 shadow-md transition-all duration-150 dark:text-amber-400"
      : "h-9 rounded-lg border border-transparent bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 text-[13px] font-semibold text-amber-600 shadow-sm transition-all duration-150 hover:border-amber-500/30 hover:from-amber-500/25 hover:via-amber-400/20 hover:to-amber-500/25 hover:shadow-md dark:text-amber-400";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pb-0 pt-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-between">
            <div className="group/logo relative flex items-center justify-center">
              <SidebarMenuButton asChild className="size-8 !px-0 items-center justify-center group-data-[collapsible=icon]:group-hover/logo:opacity-0" tooltip="AskEvo">
                <Link href="/" onClick={() => setOpenMobile(false)}>
                  <Image src="/logo.png" alt="AskEvo" width={28} height={28} className="rounded-full" />
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
                  tooltip="New Chat"
                >
                  <PenSquareIcon className="size-4" />
                  <span className="font-medium">New chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/image"))} tooltip="Image Generator">
                  <Link href="/image" onClick={() => setOpenMobile(false)}>
                    <ImageIcon className="size-4" />
                    <span className="font-medium">Image Generator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/video"))} tooltip="Video Generator">
                  <Link href="/video" onClick={() => setOpenMobile(false)}>
                    <VideoIcon className="size-4" />
                    <span className="font-medium">Video Generator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/voice"))} tooltip="Voice Generator">
                  <Link href="/voice" onClick={() => setOpenMobile(false)}>
                    <MicIcon className="size-4" />
                    <span className="font-medium">Voice Generator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={navButtonClass(isActive("/transcribe"))} tooltip="Speech to Text">
                  <Link href="/transcribe" onClick={() => setOpenMobile(false)}>
                    <FileAudioIcon className="size-4" />
                    <span className="font-medium">Speech to Text</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="mt-0.5 mb-1">
                <SidebarMenuButton asChild className={creditsButtonClass(isActive("/credits"))} tooltip="Buy Credits">
                  <Link href="/credits" onClick={() => setOpenMobile(false)}>
                    <SparklesIcon className="size-4" />
                    <span>Buy Credits</span>
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
      <SidebarFooter className="border-t border-sidebar-border pt-2 pb-3">
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
