/* eslint-disable camelcase */
"use client";

import { CardHeader } from "@/components/ui/card";
import { CustomCard } from "@/components/ui/custom-card";
import { getRandomData } from "@/utils";
import type { ReactElement } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { z } from "zod";

export const ProjectMetrics = (): ReactElement => {
  return (
    <CustomCard noHover className="relative">
      <CardHeader className="flex absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <p>Daily requests</p>
            <p className="text-sm text-muted-foreground">Last 10 days</p>
          </div>
        </div>
      </CardHeader>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={getRandomData()} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Area type="bump" dataKey="requests" stroke="#404040" fill="url(#gradient)" />

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
    </CustomCard>
  );
};