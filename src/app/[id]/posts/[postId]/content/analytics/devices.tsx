import type { Device } from "../../../../../api/user/projects/post/analytics.type";
import type { ReactElement } from "react";
import { devicesProcessor } from "@/utils/analytics";
import { CustomCard } from "@/components/ui/custom-card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const DevicesAnalyticsCard = ({ data }: { data: Device["data"] }): ReactElement => {
  return (
    <CustomCard noHover>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Top devices</CardDescription>
      </CardHeader>

      <div className="px-5 mb-6">
        {devicesProcessor(data).map(device => (
          <div
            className="bg-[#1a1a1a] p-2 rounded-md flex justify-between mb-2 relative z-0"
            key={device.device}>
            <div style={{ width: `${device.percentage}%` }} className="h-full bg-[#272727] rounded-md absolute z-1 top-0 left-0"></div>
            <div className="flex items-center gap-1.5 select-none z-10">
              <Image
                src={`https://uaparser.js.org/images/types/${device.device == "desktop" ? "default" : device.device}.png`}
                width={20}
                className="rounded-sm select-none"
                height={20}
                alt={device.device}
              />
              <p>{device.device.charAt(0).toUpperCase() + device.device.slice(1)}</p>
            </div>
            <p className="z-10">{device.count}</p>
          </div>
        ))}
      </div>

    </CustomCard>
  );
};