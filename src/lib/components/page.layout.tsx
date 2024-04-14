import type { PropsWithChildren, ReactElement } from "react";
import type { AsyncComponent } from "./utils/component";
import { createClient } from "@/utils/supabase/client";

type PageLayoutProps = {
  title: string;
} & PropsWithChildren;

const getLayout = ({ title, children }: PageLayoutProps): ReactElement => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        {children}
      </div>
    </main>
  );
};

export const PageLayout: AsyncComponent<PageLayoutProps> = async({ title, children }) => {
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

    return getLayout({ title, children: child });
  }

  return getLayout({ title, children });
};