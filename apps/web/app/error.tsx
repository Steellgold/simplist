"use client";

import { dayJS } from "@/lib/dayjs";
import { Button } from "@workspace/ui/components/button";
import { Component } from "@workspace/ui/components/utils/component";
import { IterationCcw } from "lucide-react";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
};

const Error: Component<ErrorProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error(error)
  }, [error]);

  return (
    <>
      <div className={"absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm"}>
        <h2 className="text-3xl font-bold">
          Error {error.digest ? `(${error.digest})` : ""}
        </h2>

        <p className="mb-4">
          {error.message}
        </p>

        <Button variant="outline" onClick={reset}>
          <IterationCcw className="w-4 h-4 mr-2" />
        </Button>
      </div>

      <span className="absolute bottom-0 right-0 p-2 text-xs text-gray-500">
        {dayJS().format("YYYY-MM-DD HH:mm:ss Z [UTC]")}
      </span>
    </>
  )
}

export default Error