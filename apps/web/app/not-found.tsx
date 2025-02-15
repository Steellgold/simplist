import { buttonVariants } from "@workspace/ui/components/button";
import Link from "next/link";

const NotFound = async () => {
  return (
    <div className={"absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm"}>
      <h2 className="text-lg sm:text-xl md:text-3xl font-bold">
        404: Not Found
      </h2>

      <p className="mb-4 text-center">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Go back to the homepage
      </Link>
    </div>
  )
}

export default NotFound;