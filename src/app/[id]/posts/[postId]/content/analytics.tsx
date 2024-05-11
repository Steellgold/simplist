import { useEffect, type ReactElement } from "react";
import type { Cities, Countries, Regions } from "../../../../api/user/projects/post/analytics.type";
import { CitiesAnalyticsCard } from "./analytics/cities";
import { CountriesAnalyticsCard } from "./analytics/countries";
import { RegionsAnalyticsCard } from "./analytics/regions";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";
import { getRandomData } from "@/utils";
import { CustomCard } from "@/components/ui/custom-card";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Analytics = {
  cities: Cities["data"];
  countries: Countries["data"];
  regions: Regions["data"];
  projectId: string;
  postId: string;
};

export const Analytics = ({ cities, countries, regions, postId, projectId }: Analytics): ReactElement => {
  useEffect(() => {
    const fetchGraph = async(): Promise<void> => {
      // const res = await fetch(`/api/user/projects/post/last?projectId=${projectId}&postId=${postId}&fromDate=2021-01-01&toDate=2024-05-15`);
      // const data = await res.json();
    };

    void fetchGraph();
  }, [projectId, postId]);

  return (
    <div className="w-full grid grid-cols-1 gap-4">
      <CustomCard noHover>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>Requests over time</CardDescription>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={getRandomData()} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area type="bump" dataKey="requests" stroke="#404040" fill="url(#gradient)" />

              <YAxis
                dataKey="requests"
                stroke="#404040"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => {
                  if (parseInt(value) < 1000) return value;
                  if (parseInt(value) < 1000000) return `${(parseInt(value) / 1000).toFixed(0)}k`;
                  return `${(parseInt(value) / 1000000).toFixed(0)}M`;
                }}
              />

              <XAxis
                dataKey="date"
                stroke="#404040"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: string) => {
                  return value.split("-").reverse().slice(0, 2).join("/");
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "#404040",
                  strokeWidth: 1
                }}

                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;

                  const schema = z.object({
                    date: z.string(),
                    requests: z.number()
                  }).safeParse(payload[0]?.payload);

                  if (!schema.success) return null;

                  return (
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">{schema.data.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {schema.data.requests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </div>
                  );
                }}
              />

              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#404040" stopOpacity={0.4} />
                  <stop offset="75%" stopColor="#161616" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </CustomCard>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CitiesAnalyticsCard data={cities} />
        <CountriesAnalyticsCard data={countries} />
        <RegionsAnalyticsCard data={regions} />
      </div>
    </div>
  );
};