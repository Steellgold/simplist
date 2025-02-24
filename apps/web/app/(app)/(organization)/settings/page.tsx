import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { ReactElement } from "react";

const OrganizationSettings = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "Settings", href: "/settings" }
        ]
      } />

      <div>
        <h1>Organization Settings</h1>
      </div>
    </>
  );
}

export default OrganizationSettings;