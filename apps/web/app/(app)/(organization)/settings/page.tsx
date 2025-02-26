"use client";

import { ReactElement } from "react";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { OrganizationSettingsNameForm } from "./_components/organization.name";
import { authClient } from "@/lib/auth-client";
import NotFound from "@/app/not-found";
import { OrganizationSettingsLogoForm } from "./_components/organization.logo";
import { OrganizationSettingsDeleteForm } from "./_components/organization.danger";
import { OrganizationSettingsLeaveForm } from "./_components/organization.leave";

const OrganizationSettings = (): ReactElement => {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  if (!activeOrganization) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "Settings", href: "/settings" }
        ]
      } />

      <div className="flex flex-col space-y-6">
        <OrganizationSettingsNameForm initialName={activeOrganization.name} organizationId={activeOrganization.id} />
        {/* <OrganizationSettingsSlugForm initialSlug={activeOrganization.slug} organizationId={activeOrganization.id} /> */}
      </div>

      <OrganizationSettingsLogoForm initialLogo={activeOrganization.logo ?? ""} organizationId={activeOrganization.id} />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <OrganizationSettingsLeaveForm />
        <OrganizationSettingsDeleteForm />
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