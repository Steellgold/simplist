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
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <>
                {theme === "dark" ? <Sun /> : <Moon />}
                <span>Switch to {theme === "dark" ? "light" : "dark"} mode</span>
              </>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};