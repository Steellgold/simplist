import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { ReactElement } from "react";

const OrganizationPosts = (): ReactElement => {
  return (
    <>
      <BreadcrumbSetter items={
        [
          { label: "Organization", href: "/" },
          { label: "Posts" }
        ]
      } />
      
      <div>
        <h1>Organization Posts</h1>
      </div>
    </>
  );
}

export default OrganizationPosts;