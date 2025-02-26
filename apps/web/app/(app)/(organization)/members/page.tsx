import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { ReactElement } from "react";

const OrganizationMembers = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={
        [ 
          { label: "Organization", href: "/" }, 
          { label: "Members" } 
        ]
      } />
      
      <div>
        <h1>Organization Members</h1>
      </div>
    </>
  );
}

export default OrganizationMembers;