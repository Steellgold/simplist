import { Permissions } from "@/lib/permissions";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Component } from "@workspace/ui/components/utils/component";
import { PropsWithChildren, useEffect, useState } from "react";

type SidebarLink = PropsWithChildren & {
  need?: Permissions;
};

export const AppSidebarLink: Component<SidebarLink> = ({ children, need }) => {
  const [has, setHas] = useState<boolean | null>(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const check = async () => {
      setPending(true);
      const res = await fetch("/api/auth/organization/has-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permission: need,
        })
      });

      if (res.ok) {
        const data = await res.json();
        setHas(data.success);
      } else {
        setHas(false);
      }

      setPending(false);
    }

    check();
  }, [need]);

  if (need == undefined) return <>{children}</>;
  if (pending) return <Skeleton className="h-6 w-full" />;
  if (has === false) return <></>;
  if (has === null) return <></>;
  return <>{children}</>;
};