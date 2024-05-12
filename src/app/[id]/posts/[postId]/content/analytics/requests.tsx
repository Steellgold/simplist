import type { ReactElement } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";
import { getRandomData } from "@/utils";

export const RequestsAnalyticsCard = (): ReactElement => {
  return (
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
  );
};