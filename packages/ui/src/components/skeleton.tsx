import { cn } from "@workspace/ui/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-skeleton/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
