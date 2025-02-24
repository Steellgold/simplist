import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { ReactElement } from "react";

const OrganizationSecurity = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Security" }
        ]
      } />
      
      <div>
        <h1>Organization Security</h1>
      </div>
    </>
  );
}

export default OrganizationSecurity;