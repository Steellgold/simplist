"use client";

import { Button } from "@/components/ui/button";
import { ReactElement } from "react";

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const Error = ({ error, reset }: ErrorProps): ReactElement => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="container bg-primary/5 dark:bg-primary/5 mx-auto p-4 rounded-lg text-center">
      <div className="mb-7 mt-7">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-lg text-muted-foreground">
          {error.message} {error.digest && <span>({error.digest})</span>}
        </p>

        <div className="flex flex-row gap-2 justify-center items-center mt-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export default Error;