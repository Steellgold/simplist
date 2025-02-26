import { Rendered } from "@workspace/ui/components/rendered"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton
} from "@workspace/ui/components/sidebar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ReactElement } from "react"

export const AppSidebarPlaceholder = (): ReactElement => {
  return (
    <Rendered loadingComponent={<></>}>
      <SidebarGroup>
        <SidebarGroupLabel>
          <Skeleton animated={false} className="h-4 w-1/2 rounded-md" />
        </SidebarGroupLabel>
        
        <SidebarGroupContent>
          <SidebarMenu>
            {Array.from({ length: 5 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton animated={false} showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel>
          <Skeleton animated={false} className="h-4 w-1/3 rounded-md" />
        </SidebarGroupLabel>
        
        <SidebarGroupContent>
          <SidebarMenu>
            {Array.from({ length: 3 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton animated={false} showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Rendered>
  )
}