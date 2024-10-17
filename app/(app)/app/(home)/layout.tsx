import { AppLayout } from "@/components/app-layout";
import { Component } from "@/components/component";
import { PropsWithChildren } from "react";

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <AppLayout title="Home">
      {children}
    </AppLayout>
  )
}

export default Layout;