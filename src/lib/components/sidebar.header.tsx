"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import Image from "next/image";

export const SidebarHeader = (): ReactElement => {
  const { workspace } = useWorkspaceStore();

  if (!workspace) return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Image src="/_static/logos/simplist-light.png" alt="Logo" width={120} height={17.81} />
    </div>
  );

  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Building2 className="h-6 w-6" />
        <span className="">{workspace?.name}</span>
      </Link>
    </div>
  );
};