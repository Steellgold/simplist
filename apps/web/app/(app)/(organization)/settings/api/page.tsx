"use client";

import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";

const OrganizationAPI = () => {
  return (
    <>
      <BreadcrumbSetter 
        items={[
          { label: "Organization", href: "/" },
          { label: "Settings", href: "/settings" },
          { label: "API" }
        ]} 
      />
    </>
  );
};

export default OrganizationAPI;