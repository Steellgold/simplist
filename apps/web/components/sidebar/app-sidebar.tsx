"use client"

import type * as React from "react"
import { BookOpen, Code, FileText, Settings2, Users, Zap } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@workspace/ui/components/sidebar"
import { Component } from "@workspace/ui/components/utils/component"
import { authClient } from "@/lib/auth-client"

const data = {
  workspaces: [
    {
      name: "Personal Blog",
      logo: FileText,
      plan: "Free",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: FileText,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Analytics",
          url: "#",
        },
      ],
    },
    {
      title: "Posts",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All Posts",
          url: "#",
        },
        {
          title: "Drafts",
          url: "#",
        },
        {
          title: "Scheduled",
          url: "#",
        },
      ],
    },
    {
      title: "API",
      url: "#",
      icon: Code,
      items: [
        {
          title: "Endpoints",
          url: "#",
        },
        {
          title: "Documentation",
          url: "#",
        },
        {
          title: "Usage",
          url: "#",
        },
      ],
    },
    {
      title: "Team",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Members",
          url: "#",
        },
        {
          title: "Invitations",
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
          title: "Billing",
          url: "#",
        },
        {
          title: "Integrations",
          url: "#",
        },
      ],
    },
    {
      title: "Upgrade",
      url: "#",
      icon: Zap,
    },
  ],
  projects: [
    {
      name: "Personal Blog",
      url: "#",
      icon: FileText,
    },
    {
      name: "Tech News",
      url: "#",
      icon: Code,
    },
    {
      name: "Travel Diaries",
      url: "#",
      icon: BookOpen,
    },
  ],
}

export const AppSidebar: Component<React.ComponentProps<typeof Sidebar>> = (props) => {
  const { data: session } = authClient.useSession();
  
  const user = session?.user;
  
  if (!user) {
    return <></>;
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}