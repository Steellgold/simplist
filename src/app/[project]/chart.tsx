"use client";

import { Suspense, type ReactElement } from "react";
import { AreaChart } from "@tremor/react";
import { ChartLoading } from "./chart.loading";

const chartdata = [
  { date: "Jan 22", "": 2338 },
  { date: "Feb 22", "": 2103 },
  { date: "Mar 22", "": 2194 },
  { date: "Apr 22", "": 2108 },
  { date: "May 22", "": 1812 },
  { date: "Jun 22", "": 1726 },
  { date: "Jul 22", "": 1982 },
  { date: "Aug 22", "": 2012 },
  { date: "Sep 22", "": 2342 },
  { date: "Oct 22", "": 2473 },
  { date: "Nov 22", "": 3848 },
  { date: "Dec 22", "": 3736 }
];

const dataFormatter = (value: number): string => {
  return value.toString();
};

export const Chart = (): ReactElement => {
  return (
    <Suspense fallback={<ChartLoading />}>
      <AreaChart
        className="h-32"
        data={chartdata}
        index="date"
        noDataText="No data available."
        categories={[""]}
        colors={["primary"]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        showGridLines={false}
        showTooltip={false}
        showXAxis={false}
        showYAxis={false}
        curveType="step"
        showLegend={false}
        onValueChange={(v) => console.log(v)}
      />
    </Suspense>
  );
};