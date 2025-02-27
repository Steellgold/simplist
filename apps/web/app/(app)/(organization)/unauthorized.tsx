import { dayJS } from "@/lib/dayjs";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { ReactElement } from "react";

const Unauthorized = async (): Promise<ReactElement> => {
  return (
    <>
      <div className={"absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm"}>
        <h2 className="text-3xl font-bold">
          Unauthorized
        </h2>

        <p className="mb-4">
          You are not authorized to access this page.
        </p>

        <Button variant="outline" asChild>
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>

      <span className="absolute bottom-0 right-0 p-2 text-xs text-gray-500">
        {dayJS().format("YYYY-MM-DD HH:mm:ss Z [UTC]")}
      </span>
    </>
  )
}

export default Unauthorized;