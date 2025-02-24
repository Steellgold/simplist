import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { ReactElement } from "react";

const OrganizationAnalytics = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "Analytics" }
        ]
      } />
      
      <div>
        <h1>Organization Analytics</h1>
      </div>
    </>
  );
}

export default OrganizationAnalytics;