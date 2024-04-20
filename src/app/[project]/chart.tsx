"use client";

import { Suspense } from "react";
import { AreaChart } from "@tremor/react";
import { ChartLoading } from "./chart.loading";
import type { Component } from "@/components/utils/component";

const dataFormatter = (value: number): string => {
  return `: ${value.toString()}`;
};

type ChartProps = {
  data: Array<{ date: string; "R/D": number }>;
};

export const Chart: Component<ChartProps> = ({ data }) => {
  const chartdata = data.map((d) => {
    return {
      date: d.date,
      "Requests": d["R/D"]
    };
  });


  return (
    <Suspense fallback={<ChartLoading />}>
      <AreaChart
        className="h-20"
        data={chartdata}
        index="date"
        noDataText="No data available."
        categories={["Requests"]}
        colors={["primary"]}
        yAxisWidth={60}
        showGridLines={false}
        valueFormatter={dataFormatter}
        showXAxis={false}
        showYAxis={false}
        curveType="natural"
        showLegend={false}
      />
    </Suspense>
  );
};