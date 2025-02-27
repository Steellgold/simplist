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
                  { title: "Authentification", url: "/account/authentification" },
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
                        //
                        {
                          title: "Posts", url: "/posts",
                          permissionsNeeded: { posts: ["create"] },
                        },
                        //
                        {
                          title: "Analytics", url: "/analytics",
                          permissionsNeeded: { analytics: ["view"] },
                        },
                        //
                        {
                          title: "Members", url: "/members",
                          permissionsNeeded: { members: ["view"] }
                        },
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
                      permissionsNeeded: { settings: ["view"] },
                      items: [
                        {
                          title: "General", url: "/settings",
                          permissionsNeeded: { settings: ["view"] }
                        },
                        //
                        {
                          title: "API", url: "/settings/api",
                          permissionsNeeded: { apikeys: ["create"] }
                        },
                        //
                        {
                          title: "Billing", url: "/settings/billing",
                          permissionsNeeded: { settings: ["delete"] }
                        }
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

        {
          (!data || data.length === 0 || isPending || isRefetching) && !path.startsWith("/account") ? (
            <AppSidebarPlaceholder />
          ) : (
            <></>
          )
        }
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarTheme />
        <AppSidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}