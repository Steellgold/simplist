"use client";

import { ReactElement } from "react";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { OrganizationSettingsNameForm } from "./_components/organization.name";
import { OrganizationSettingsSlugForm } from "./_components/organization.slug";
import { authClient } from "@/lib/auth-client";
import NotFound from "@/app/not-found";
import { OrganizationSettingsLogoForm } from "./_components/organization.logo";

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
        <OrganizationSettingsSlugForm initialSlug={activeOrganization.slug} organizationId={activeOrganization.id} />
      </div>

      <OrganizationSettingsLogoForm initialLogo={activeOrganization.logo ?? ""} organizationId={activeOrganization.id} />
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