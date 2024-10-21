import { Component } from "@/components/component";
import { ResponsiveNavbarComponent } from "@/components/navbar/responsive-navbar";
import { PropsWithChildren } from "react";

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container mx-auto p-4 mt-16">
      <ResponsiveNavbarComponent />
      {children}
    </div>
  )
}

export default Layout;