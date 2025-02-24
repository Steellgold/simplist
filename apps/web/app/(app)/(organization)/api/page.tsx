import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { ReactElement } from "react";

const OrganizationAPI = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "API" }
        ]
      } />
      
      <div>
        <h1>Organization API</h1>
      </div>
    </>
  );
}

export default OrganizationAPI;