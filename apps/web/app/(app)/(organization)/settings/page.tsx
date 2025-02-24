import { ReactElement } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { OrganizationSettingsNameForm } from "./_components/organization.name";

const OrganizationSettings = async(): Promise<ReactElement> => {
  const activeOrganization = await auth.api.getFullOrganization({
    headers: await headers()
  });

  if (!activeOrganization) {
    return <div>Organization not found</div>;
  }

  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "Settings", href: "/settings" }
        ]
      } />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <OrganizationSettingsNameForm initialName={activeOrganization.name} organizationId={activeOrganization.id} />
      </div>
    </>
  );

  // return (
  //   <>
  //     <BreadcrumbSetter items={
  //       [
  //         { label: "Organization", href: "/" },
  //         { label: "Settings", href: "/settings" }
  //       ]
  //     } />

  //     <>
  //       <OrganizationSettingsNameForm />
  //     </>
  //   </>
  // );
}

export default OrganizationSettings;