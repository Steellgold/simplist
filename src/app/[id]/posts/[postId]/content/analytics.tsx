import type { PropsWithChildren } from "react";
import type { ReactElement } from "react";
import type { Browser, Cities, Countries, Device, Os, Regions } from "../../../../api/user/projects/post/analytics.type";
import { CitiesAnalyticsCard } from "./analytics/cities";
import { CountriesAnalyticsCard } from "./analytics/countries";
import { RegionsAnalyticsCard } from "./analytics/regions";
import { CustomCard } from "@/components/ui/custom-card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DevicesAnalyticsCard } from "./analytics/devices";
import { OSsAnalyticsCard } from "./analytics/OSs";
import { BrowsersAnalyticsCard } from "./analytics/browsers";
import { RequestsAnalyticsCard } from "./analytics/requests";
import type { SelectTime } from "@/utils/analytics";

type Analytics = PropsWithChildren & {
  cities: Cities["data"];
  countries: Countries["data"];
  regions: Regions["data"];
  devices: Device["data"];
  OSs: Os["data"];
  browsers: Browser["data"];

  selectedTime: SelectTime;
  graphData: { date: string; requests: number }[];
};

export const Analytics = ({
  cities, countries, regions,
  devices, OSs, browsers,
  selectedTime, graphData,
  children
}: Analytics): ReactElement => {
  return (
    <div className="w-full grid grid-cols-1 gap-4">
      <CustomCard noHover>
        <CardHeader className="flex justify-between flex-row items-center">
          <div className="flex flex-col">
            <CardTitle>
              Requests {
                selectedTime === "today" ? "from last 24 hours"
                  : selectedTime === "yesterday" ? "from yesterday"
                    : selectedTime === "week" ? "from last week"
                      : selectedTime === "month" ? "from last month"
                        : selectedTime === "3months" ? "from last 3 months"
                          : selectedTime === "6months" ? "from last 6 months"
                            : selectedTime === "year" ? "from last year"
                              : selectedTime === "all" ? "from all time" : ""
              }
            </CardTitle>
            <CardDescription>
              Requests over time {graphData.length > 0 && `(${graphData.reduce((acc, curr) => acc + curr.requests, 0)})`}</CardDescription>
          </div>

          {children}
        </CardHeader>

        <CardContent>
          <RequestsAnalyticsCard data={graphData} />
        </CardContent>
      </CustomCard>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CitiesAnalyticsCard data={cities} />
        <CountriesAnalyticsCard data={countries} />
        <RegionsAnalyticsCard data={regions} />
        <DevicesAnalyticsCard data={devices} />
        <OSsAnalyticsCard data={OSs} />
        <BrowsersAnalyticsCard data={browsers} />
      </div>
    </div>
  );
};