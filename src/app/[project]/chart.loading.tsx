import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

export const ChartLoading = (): ReactElement => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-10 w-10 text-primary" />
    </div>
  );
};