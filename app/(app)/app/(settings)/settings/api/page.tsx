import { getKeys } from "@/lib/actions/key/key.action";
import type { ReactElement } from "react";
import { KeyButtonCreate } from "./test";

const Page = async(): Promise<ReactElement> => {
  const keys = await getKeys();
  console.log(keys);

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1>API Keys</h1>

      <KeyButtonCreate />
    </div>
  );
};

export default Page;