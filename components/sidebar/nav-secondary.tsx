"use client";

import { Moon, Sun, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import type { Component } from "../component";
import { useTheme } from "next-themes";
import type { ComponentPropsWithoutRef } from "react";
import { ClientOnly } from "../ui/client-only";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

type NavSecondaryProps = {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & ComponentPropsWithoutRef<typeof SidebarGroup>;

export const NavSecondary: Component<NavSecondaryProps> = ({ items, ...props }) => {
  const { setTheme, theme } = useTheme();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url}>
                  <ClientOnly fallback={<Skeleton className="w-3 h-3" />}>
                    <item.icon />
                  </ClientOnly>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <ClientOnly fallback={<Skeleton className="w-20 h-6" />}>
              <SidebarMenuButton size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <>
                  {theme === "dark" ? <Sun /> : <Moon />}
                  <span>Switch to {theme === "dark" ? "light" : "dark"} mode</span>
                </>
              </SidebarMenuButton>
            </ClientOnly>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};