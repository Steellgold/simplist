import { useState, type PropsWithChildren } from "react";
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
import { cn } from "@/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, LineChart } from "lucide-react";

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
  const [type, setType] = useState<"step" | "monotone">("monotone");

  return (
    <div className="w-full grid grid-cols-1 gap-4">
      <CustomCard noHover>
        <CardHeader className="flex justify-between flex-col sm:flex-row">
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

          <div className="flex items-center gap-4">
            {children}

            <Tabs defaultValue="account" onValueChange={(value) => setType(value as "step" | "monotone")}>
              <TabsList>
                <TabsTrigger value="monotone">
                  <LineChart size={16} />
                </TabsTrigger>
                <TabsTrigger value="step">
                  <BarChart2 size={16} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          <RequestsAnalyticsCard data={graphData} type={type} />
        </CardContent>
      </CustomCard>

      <div className={cn("w-full gap-4", {
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": (
          cities.length > 0 || countries.length > 0 || regions.length > 0
          || devices.length > 0 || OSs.length > 0 || browsers.length > 0
        ),
        "mt-4": (
          cities.length <= 0 && countries.length <= 0 && regions.length <= 0
          && devices.length <= 0 && OSs.length <= 0 && browsers.length <= 0
        )
      })}>
        {cities.length > 0 && <CitiesAnalyticsCard data={cities} />}
        {countries.length > 0 && <CountriesAnalyticsCard data={countries} />}
        {regions.length > 0 && <RegionsAnalyticsCard data={regions} />}
        {devices.length > 0 && <DevicesAnalyticsCard data={devices} />}
        {OSs.length > 0 && <OSsAnalyticsCard data={OSs} />}
        {browsers.length > 0 && <BrowsersAnalyticsCard data={browsers} />}

        {
          cities.length === 0 && countries.length === 0 && regions.length === 0
          && devices.length === 0 && OSs.length === 0 && browsers.length === 0
          && <div className="w-full flex justify-center items-center">
            <p className="text-gray-400">Your post has no analytics data yet. Check back later or choose a different time range.</p>
          </div>
        }
      </div>
    </div>
  );
};