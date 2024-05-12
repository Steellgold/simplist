import type { Browser } from "../../../../../api/user/projects/post/analytics.type";
import type { ReactElement } from "react";
import { browsersProcessor } from "@/utils/analytics";
import { CustomCard } from "@/components/ui/custom-card";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const BrowsersAnalyticsCard = ({ data }: { data: Browser["data"] }): ReactElement => {
  return (
    <CustomCard noHover>
      <CardHeader>
        <CardTitle>Browsers</CardTitle>
        <CardDescription>Top browsers</CardDescription>
      </CardHeader>

      <div className="px-5 mb-6">
        {browsersProcessor(data).map(browser => (
          <div
            className="bg-[#1a1a1a] p-2 rounded-md flex justify-between mb-2 relative z-0"
            key={browser.browser}>
            <div style={{ width: `${browser.percentage}%` }} className="h-full bg-[#272727] rounded-md absolute z-1 top-0 left-0"></div>
            <div className="flex items-center gap-1.5 select-none z-10">
              <Image
                src={`https://uaparser.js.org/images/browsers/${rewriteBrowserName(browser.browser)}.png`}
                width={20}
                className="rounded-sm select-none"
                height={20}
                alt={browser.browser}
              />
              <p>{browser.browser.charAt(0).toUpperCase() + browser.browser.slice(1)}</p>
            </div>
            <p className="z-10">{browser.count}</p>
          </div>
        ))}
      </div>

    </CustomCard>
  );
};

export const rewriteBrowserName = (browser: string): string => {
  switch (browser) {
    case "Samsung Internet":
      return "samsung%20browser";
    case "Avant":
      return "default";
    default:
      return browser.toLowerCase().replace(/\s/g, "-");
  }
};