"use client";

import { env } from "@/env.mjs";
import { cn } from "@/utils";
import { Building2, Folders, KeySquare, Settings2Icon, StickyNote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

type Link = {
  href: string;
  label: string;
  icon?: ReactElement;
  disabled?: boolean;
}

const links: Link[] = [
  { href: "/[cuid]", label: "Dashboard", icon: <Building2 className="h-4 w-4" /> },
  { href: "/[cuid]/keys", label: "API Keys", icon: <KeySquare className="h-4 w-4" /> },
  { href: "/[cuid]/posts", label: "Posts", icon: <StickyNote className="h-4 w-4" /> },
  { href: "/[cuid]/settings", label: "Settings", icon: <Settings2Icon className="h-4 w-4" /> }
];

const homeLink: Link[] = [{ href: "/", label: "Projects", icon: <Folders className="h-4 w-4" /> }];

const validLink = (link: string, cuid: string): string => {
  return link.replace("[cuid]", cuid);
};

type getSidebarLinksProps= {
  type: "sidebar-mobile" | "sidebar-desktop";
  user?: boolean;
}

export const SidebarLinks = ({ type }: getSidebarLinksProps): ReactElement => {
  const url = usePathname();

  if (url == "/") {
    return (
      <>
        {homeLink.map((link, index) => (
          <Link
            href={link.href}
            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            key={index}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </>
    );
  }

  const cuid = url.split("/")[1];

  const activeStyleMobile = "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground";
  const activeStyleDesktop = "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";
  const inactiveStyleMobile = "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground";
  const inactiveStyleDesktop = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";

  if (type === "sidebar-desktop") {
    return (
      <>
        {links.map((link, index) => (
          <Link
            href={env.NEXT_PUBLIC_APP_URL + "/" + validLink(link.href, cuid)}
            className={cn(
              url === validLink(link.href, cuid) ? activeStyleDesktop : inactiveStyleDesktop
            )}
            key={index}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <>
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
        <Image src="/_static/logos/simplist-light.png" alt="Simplist" width={120} height={17.81} />
      </Link>

      {links.map((link, index) => (
        <Link
          href={env.NEXT_PUBLIC_APP_URL + "/" + validLink(link.href, cuid)}
          className={cn(
            url === validLink(link.href, cuid) ? activeStyleMobile : inactiveStyleMobile
          )}
          key={index}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </>
  );
};