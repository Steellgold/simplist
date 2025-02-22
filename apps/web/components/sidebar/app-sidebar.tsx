"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@workspace/ui/components/sidebar";
import { Component } from "@workspace/ui/components/utils/component";
import { AppSidebarUser } from "./app-sidebar-user";
import React from "react";
import { AppSidebarTheme } from "./app-sidebar-theme";
import { usePathname } from "next/navigation";
import { AppSidebarLinks } from "./app-sidebar-links";
import { Settings } from "lucide-react";
import { AppSidebarOrganization } from "./app-sidebar-organization";
import { AppSidebarPlaceholder } from "./app-sidebar-placeholder";
import { authClient } from "@/lib/auth-client";

export const AppSidebar: Component<React.ComponentProps<typeof Sidebar>> = (props) => {
  const { data, isPending, isRefetching } = authClient.useListOrganizations();
  const path = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <AppSidebarOrganization />
      </SidebarHeader>
      <SidebarContent>
        {path.startsWith("/account") ? (
          <AppSidebarLinks
            name="Personal Settings"
            links={[
              {
                title: "Settings",
                url: "/account/settings",
                isActive: path.startsWith("/account"),
                icon: Settings,
                items: [
                  { title: "General", url: "/account/settings" },
                  { title: "Security", url: "/account/security" }
                ],
              }
            ]}
          />
        ) : (
          // <NavLinks links={data.links} />
          <></>
        )}

        {/* <NavProjects projects={data.projects} /> */}
        
        {
          (!data || data.length === 0 || isPending || isRefetching) && !path.startsWith("/account") ? (
          <AppSidebarPlaceholder />
        ) : (
          <></>
        )}
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarTheme />
        <AppSidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}