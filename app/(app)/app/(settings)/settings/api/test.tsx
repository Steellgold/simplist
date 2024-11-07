"use client";

import { useCreateKey } from "@/lib/actions/key/key.hook";
import type { ReactElement } from "react";

export const KeyButtonCreate = (): ReactElement => {
  const create = useCreateKey();

  return (
    <button onClick={() => create.mutate({})} className="btn btn-primary">
      Create Key
    </button>
  );
};