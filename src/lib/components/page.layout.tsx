import type { PropsWithChildren, ReactElement } from "react";
import type { AsyncComponent } from "./utils/component";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/utils";
import { db } from "@/utils/db/prisma";
import { AccessDenied, NotFound, NotLogged } from "./errors";

type PageLayoutProps = {
  title?: string;
  description?: string;
  center?: boolean;
  actions?: ReactElement;
  bordered?: boolean;
  projectId?: string;
  error?: boolean;
} & PropsWithChildren;

const getLayout = ({ title, description, children, center = true, actions, bordered = true, error }: PageLayoutProps): ReactElement => {
  return (
    <main className={cn("flex flex-1 flex-col", {
      "gap-4 p-4 lg:gap-6 lg:p-6": !error && bordered,
      "p-4": (!error && !bordered) || error
    })}>
      {!error && (
        <div className={"flex-col md:flex-row md:justify-between flex md:items-center gap-3 md:gap-0"}>
          <div className={cn({
            "flex items-center gap-1": !description,
            "flex flex-col": description
          }, "justify-between")}>
            <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
            {description && <p className="text-muted-foreground text-base">{description}</p>}
          </div>

          {actions && actions}
        </div>
      )}
      <div className={cn({
        "h-full rounded-lg shadow-sm": !center,
        "flex flex-1 items-center justify-center rounded-lg shadow-sm p-3": center,
        "border border-dashed": bordered
      })}>
        {children}
      </div>
    </main>
  );
};

export const PageLayout: AsyncComponent<PageLayoutProps>
= async({ title, description, children, center = true, actions, bordered = true, projectId, error }) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (projectId) {
    const project = await db.project.findFirst({ where: { id: projectId } });
    if (!project) {
      return getLayout({ title: "Not found", children: <NotFound />, center: true, description, actions, bordered, error: true });
    }

    if (project.userId !== user?.id) {
      return getLayout({ title: "Access denied", children: <AccessDenied />, center: true, description, actions, bordered, error: true });
    }
  }

  if (!user) {
    return getLayout({ title, children: <NotLogged />, center: true, description, actions, bordered, error: true || error });
  }

  return getLayout({ title, children, center, description, actions, bordered, error });
};