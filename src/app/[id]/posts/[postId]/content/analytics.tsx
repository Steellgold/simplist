import { useEffect, type ReactElement } from "react";
import type { Cities, Countries, Regions } from "../../../../api/user/projects/post/analytics.type";
import { CitiesAnalyticsCard } from "./analytics/cities";
import { CountriesAnalyticsCard } from "./analytics/countries";
import { RegionsAnalyticsCard } from "./analytics/regions";
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
      // const res = await fetch(`/api/user/projects/post/dates?projectId=${projectId}&postId=${postId}&fromDate=2021-01-01&toDate=2024-05-15`);
      // const data = await res.json();
      // console.log(data);
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
          {/* <RequestsAnalyticsCard /> */}
          <p>
            Graph not implemented yet
          </p>
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