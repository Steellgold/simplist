import type { PropsWithChildren, ReactElement } from "react";
import type { AsyncComponent } from "./utils/component";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/utils";

type PageLayoutProps = {
  title: string;
  description?: string;
  center?: boolean;
} & PropsWithChildren;

const getLayout = ({ title, description, children, center = true }: PageLayoutProps): ReactElement => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className={cn({
        "flex items-center gap-1": !description,
        "flex flex-col": description
      })}>
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
        {description && <p className="text-muted-foreground text-base">{description}</p>}
      </div>
      <div className={cn({
        "flex h-[100%] rounded-lg border border-dashed shadow-sm p-3": !center,
        "flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm": center
      })}>
        {children}
      </div>
    </main>
  );
};

export const PageLayout: AsyncComponent<PageLayoutProps> = async({ title, description, children, center = true }) => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const child = (
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You are not logged in
        </h3>
        <p className="text-sm text-muted-foreground">You need to be logged in to view this page.</p>
      </div>
    );

    return getLayout({ title, children: child, center, description });
  }

  return getLayout({ title, children, center, description });
};