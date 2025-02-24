"use client";

import { AppSidebarOrganization } from "@/components/sidebar/app-sidebar-organization";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { Building } from "lucide-react";
import { ReactElement } from "react";

export const SelectOrganization = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={[{ label: "Home", href: "/" }, { label: "Select your organization" }]} />

      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-8 md:p-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-1xl md:text-2xl font-semibold tracking-tight">
              Select your organization
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              You have one or more organizations, but none are selected. Please select one to continue.
            </p>

            <div className="bg-sidebar rounded-lg p-0.5 w-[250px] mt-3">
              <AppSidebarOrganization side="bottom" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}