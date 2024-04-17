import { PageLayout } from "@/components/page.layout";
import type { Component } from "@/components/utils/component";
import type { PropsWithChildren } from "react";

type NewPostLayoutProps = PropsWithChildren & {
  params: {
    project: string;
  };
};

const NewPostLayout: Component<NewPostLayoutProps> = ({ children, params }) => {
  const { project } = params;

  return (
    <PageLayout projectId={project} bordered={false} center={false}>
      {children}
    </PageLayout>
  );
};

export default NewPostLayout;