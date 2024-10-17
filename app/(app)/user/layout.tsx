import { Component } from "@/components/component";
import { PropsWithChildren } from "react";

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default Layout;