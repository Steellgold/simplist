import type { Regions } from "../../../../../api/user/projects/post/analytics.type";
import type { ReactElement } from "react";
import { regionsProcessor } from "@/utils/analytics";
import { CustomCard } from "@/components/ui/custom-card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export const RegionsAnalyticsCard = ({ data }: { data: Regions["data"] }): ReactElement => {

  return (
    <CustomCard noHover>
      <CardHeader>
        <CardTitle>Regions</CardTitle>
        <CardDescription>Top regions</CardDescription>
      </CardHeader>

      <div className="px-4">
        {regionsProcessor(data).map(region => (
          <div
            className="bg-[#1a1a1a] p-2 rounded-md flex justify-between mb-2 relative z-0"
            key={region.region}>
            {/* Mettre une barre de "progression" en fonction du nombre de visites par rapport aux autres villes  */}
            <div style={{ width: `${region.count}%` }} className="h-full bg-[#272727] rounded-md absolute z-1 top-0 left-0"></div>
            <div className="flex items-center gap-1.5 select-none z-10">
              <Image
                src={`https://flag.vercel.app/m/${region.country_code}.svg`}
                width={20}
                className="rounded-sm select-none"
                height={20}
                alt={region.region}
              />
              <Link href={`https://www.google.com/search?q=${region.region}`} passHref className="hover:underline" target="_blank">
                {region.region}
              </Link>
            </div>
            <p>{region.count}</p>
          </div>
        ))}
      </div>
    </CustomCard>
  );
};