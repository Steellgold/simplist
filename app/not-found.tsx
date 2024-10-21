import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import type { ReactElement } from "react";

const NotFound = (): ReactElement => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="container bg-primary/5 dark:bg-primary/5 mx-auto p-4 rounded-lg text-center">
      <div className="mb-7 mt-7">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-lg text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-row gap-2 justify-center items-center mt-4">
          <Link className={buttonVariants({ variant: "default" })} href="/">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default NotFound;