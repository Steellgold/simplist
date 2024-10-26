import { BreadcrumbUpdater } from "@/components/breadcrumbUpdater";
import { Editor } from "@/components/editor/editor";
import type { ReactElement } from "react";

const Page = (): ReactElement => {
  return (
    <>
      <BreadcrumbUpdater links={[
        { href: "/app", label: "Overview" },
        { href: "/app/posts", label: "Posts" }
      ]} title="New post" />

      <Editor isNew={true} />
    </>
  );
};

export default Page;