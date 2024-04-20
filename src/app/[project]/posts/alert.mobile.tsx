"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Ruler } from "lucide-react";
import type { ReactElement } from "react";
import { useWindowSize } from "usehooks-ts";

export const MobileAlert = (): ReactElement => {
  const { width } = useWindowSize();

  if (width < 768) {
    return (
      <Alert className="mb-2" variant={"info"}>
        <Ruler className="h-4 w-4" />
        <AlertTitle>Responsive Alert</AlertTitle>
        <AlertDescription>
        Certain elements in the table are not displayed on mobile devices, we recommend using a desktop or larger screen to view all elements.
        </AlertDescription>
      </Alert>
    );
  }

  return <></>;
};