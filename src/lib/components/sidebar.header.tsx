"use client";

import { Building2 } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";
import { useProjectStore } from "@/store/project.store";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const SidebarHeader = (): ReactElement => {
  const { activeProject } = useProjectStore();
  const url = usePathname();

  if (!activeProject || url === "/") return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/">
        <Image src="/_static/logos/simplist-light.png" alt="Logo" width={120} height={17.81} />
      </Link>
    </div>
  );

  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Building2 className="h-6 w-6" />
        <span className="">{activeProject.name}</span>
      </Link>
    </div>
  );
};