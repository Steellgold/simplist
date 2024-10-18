"use client"

import { BookOpen, ChevronsUpDown, LayoutGrid, LifeBuoy, Plus, Send, Settings2 } from "lucide-react"
import { NavProject } from "@/components/nav-project"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Component } from "./component"
import { useActiveOrganization, useListOrganizations, client } from "@/lib/auth/client";
import { Skeleton } from "./ui/skeleton"
import { ComponentProps } from "react"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "#",
      icon: LayoutGrid,
      isActive: true,
      items: [
        {
          title: "Posts",
          url: "#",
        },
        {
          title: "Categories",
          url: "#",
        },
        {
          title: "Tags",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Members",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ]
}

export const AppSidebar: Component<ComponentProps<typeof Sidebar>> = (props) => {
  const { data: organizations, isPending: isPendingListOrganizations } = useListOrganizations();
  const { data: organization, isPending: isPendingActiveOrganization } = useActiveOrganization();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {isPendingActiveOrganization || isPendingListOrganizations ? (
              <Skeleton className="w-full h-[54px] bg-secondary" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{organization?.name}</span>
                      <span className="truncate text-xs">{organization?.slug}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side="bottom" sideOffset={4}>
                  {organizations && organizations.length > 0 && <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>}
                  {organizations && organizations.length > 0 && organizations.map((org, index) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => client.organization.setActive(organizations?.[index].id ?? "")}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        {org.logo} 
                      </div>
                      {org.name}
                      
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  
                  {organizations && organizations.length > 0 && <DropdownMenuSeparator />}

                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">New organization</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    
      <SidebarContent>
        <NavProject items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
