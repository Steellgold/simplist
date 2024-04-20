"use client";

import { Suspense } from "react";
import { AreaChart } from "@tremor/react";
import { ChartLoading } from "./chart.loading";
import type { Component } from "@/components/utils/component";

const dataFormatter = (value: number): string => {
  return value.toString();
};

type ChartProps = {
  data: Array<{ date: string; "R/D": number }>;
};

export const Chart: Component<ChartProps> = ({ data }) => {
  const chartdata = data.map((d) => {
    return {
      date: d.date,
      "R/D": d["R/D"]
    };
  });


  return (
    <Suspense fallback={<ChartLoading />}>
      <AreaChart
        className="h-20"
        data={chartdata}
        index="date"
        noDataText="No data available."
        categories={["R/D"]}
        colors={["primary"]}
        valueFormatter={dataFormatter}
        yAxisWidth={60}
        showGridLines={false}
        showTooltip={false}
        showXAxis={false}
        showYAxis={false}
        curveType="natural"
        showLegend={false}
        onValueChange={(v) => console.log(v)}
      />
    </Suspense>
  );
};