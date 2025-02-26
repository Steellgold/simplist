import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AutoBreadcrumb } from "@workspace/ui/components/auto-breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Component } from "@workspace/ui/components/utils/component";
import { PropsWithChildren } from "react";

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AutoBreadcrumb />
          </div>
        </header>

        <div className="p-4 md:p-3 lg:p-0">
          <div className="space-y-6 max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout;