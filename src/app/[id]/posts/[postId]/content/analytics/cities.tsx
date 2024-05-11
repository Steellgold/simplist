import type { Cities } from "../../../../../api/user/projects/post/analytics.type";
import type { ReactElement } from "react";
import { citiesProcessor } from "@/utils/analytics";
import { CustomCard } from "@/components/ui/custom-card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const CitiesAnalyticsCard = ({ data }: { data: Cities["data"] }): ReactElement => {

  return (
    <CustomCard noHover>
      <CardHeader>
        <CardTitle>Cities</CardTitle>
        <CardDescription>Top cities</CardDescription>
      </CardHeader>

      <div className="px-4">
        {citiesProcessor(data).map(city => (
          <div
            className="bg-[#1a1a1a] p-2 rounded-md flex justify-between mb-2 relative z-0"
            key={city.city}>
            {/* Mettre une barre de "progression" en fonction du nombre de visites par rapport aux autres villes  */}
            <div style={{ width: `${city.count}%` }} className="h-full bg-[#272727] rounded-md absolute z-1 top-0 left-0"></div>
            <div className="flex items-center gap-1.5 select-none z-10">
              <Image
                src={`https://flag.vercel.app/m/${city.country_code}.svg`}
                width={20}
                className="rounded-sm select-none"
                height={20}
                alt={city.city}
              />
              <p>{city.city}</p>
            </div>
            <p>{city.count}</p>
          </div>
        ))}
      </div>
    </CustomCard>
  );
};