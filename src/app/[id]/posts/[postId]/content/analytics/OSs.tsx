import type { Os } from "../../../../../api/user/projects/post/analytics.type";
import type { ReactElement } from "react";
import { osProcessor } from "@/utils/analytics";
import { CustomCard } from "@/components/ui/custom-card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const OSsAnalyticsCard = ({ data }: { data: Os["data"] }): ReactElement => {
  return (
    <CustomCard noHover>
      <CardHeader>
        <CardTitle>Operating Systems</CardTitle>
        <CardDescription>Top operating systems</CardDescription>
      </CardHeader>

      <div className="px-5 mb-6">
        {osProcessor(data).map(os => (
          <div
            className="bg-[#1a1a1a] p-2 rounded-md flex justify-between mb-2 relative z-0"
            key={os.os}>
            <div style={{ width: `${os.percentage}%` }} className="h-full bg-[#272727] rounded-md absolute z-1 top-0 left-0"></div>
            <div className="flex items-center gap-1.5 select-none z-10">
              <Image
                src={`https://uaparser.js.org/images/os/${os.os.toLocaleLowerCase()}.png`}
                width={20}
                className="select-none"
                height={20}
                alt={os.os}
              />
              <p>{os.os.charAt(0).toUpperCase() + os.os.slice(1)}</p>
            </div>
            <p className="z-10">{os.count}</p>
          </div>
        ))}
      </div>

    </CustomCard>
  );
};