"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@workspace/ui/components/sidebar";
import { Component } from "@workspace/ui/components/utils/component";
import { AppSidebarUser } from "./app-sidebar-user";
import React from "react";
import { AppSidebarTheme } from "./app-sidebar-theme";
import { usePathname } from "next/navigation";
import { AppSidebarLinks } from "./app-sidebar-links";
import { LayoutDashboard, Settings } from "lucide-react";
import { AppSidebarOrganization } from "./app-sidebar-organization";
import { AppSidebarPlaceholder } from "./app-sidebar-placeholder";
import { authClient } from "@/lib/auth-client";

export const AppSidebar: Component<React.ComponentProps<typeof Sidebar>> = (props) => {
  const { data, isPending, isRefetching } = authClient.useListOrganizations();

  const {
    data: activeOrganization,
    isPending: isActiveOrganizationPending,
    isRefetching: isActiveOrganizationRefetching
  } = authClient.useActiveOrganization();

  const path = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <AppSidebarOrganization />
      </SidebarHeader>
      <SidebarContent className="-space-y-4">
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
          <>
            {
              activeOrganization &&
              !isActiveOrganizationPending &&
              !isActiveOrganizationRefetching &&
              !isRefetching &&
              path.startsWith("/") ? (
              <>
                <AppSidebarLinks
                  name="Organization"
                  links={[
                    {
                      title: "Dashboard",
                      url: "/",
                      isActive: path.startsWith("/"),
                      icon: LayoutDashboard,
                      items: [
                        { title: "Overview", url: "/" },
                        { title: "Posts", url: "/posts" },
                        { title: "Analytics", url: "/analytics" },
                        { title: "API", url: "/api" },
                        { title: "Members", url: "/members" },
                      ]
                    }
                  ]}
                />

                <AppSidebarLinks
                  name="Settings"
                  links={[
                    {
                      title: "Settings",
                      url: "/settings",
                      isActive: path.startsWith("/settings"),
                      icon: Settings,
                      items: [
                        { title: "General", url: "/settings" },
                        { title: "Security", url: "/settings/security" },
                        { title: "Billing", url: "/settings/billing" }
                      ]
                    }
                  ]}
                />
              </>
            ) : (
              <>
                {data && data.length < 1 ? <></> : <AppSidebarPlaceholder />}
              </>
            )}
          </>
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