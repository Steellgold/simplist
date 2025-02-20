"use client";

import { useState, useEffect } from "react";

type UseIsPasskeyAvailable = () => boolean;

export const useIsPasskeyAvailable: UseIsPasskeyAvailable = () => {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (typeof PublicKeyCredential !== "undefined") {
      if (
        !("isConditionalMediationAvailable" in PublicKeyCredential) || 
        !(PublicKeyCredential as any).isConditionalMediationAvailable()
      ) {
        console.log("WebAuthn is not supported in this browser");
        return;
      }

      setAvailable(true);
    }
  }, []);

  return available;
}