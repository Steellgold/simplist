import { Permissions } from "@/lib/permissions"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@workspace/ui/components/sidebar"
import { Component } from "@workspace/ui/components/utils/component"
import { ChevronRight, LucideIcon } from "lucide-react"
import Link from "next/link"
import { Guard } from "@/components/guard"

type SidebarLink = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  permissionsNeeded?: Permissions;
  items?: {
    title: string;
    url: string;
    permissionsNeeded?: Permissions;
  }[]
}

export const AppSidebarLinks: Component<{
  name: string
  links: SidebarLink[]
}> = ({ name, links }) => {
  return (
    <SidebarGroup>
      <Guard need={links[0] ? (links[0].permissionsNeeded || undefined) : undefined}>
        <SidebarGroupLabel>{name}</SidebarGroupLabel>
        <SidebarMenu>
          {links.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <Guard key={subItem.title} need={subItem.permissionsNeeded}>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </Guard>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </Guard>
    </SidebarGroup>
  )
}