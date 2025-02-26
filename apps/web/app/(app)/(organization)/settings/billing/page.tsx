import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { ReactElement } from "react";

const OrganizationBilling = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "Billing" }
        ]
      } />

      <div>
        <h1>Organization Billing</h1>
      </div>
    </>
  );
}

export default OrganizationBilling;