/* eslint-disable camelcase */
import type { z } from "zod";
import type {
  BrowserSchema, CitiesSchema, CountriesSchema, DeviceSchema, OsSchema, RegionsSchema, RequestsSchema
} from "../../app/api/user/projects/post/analytics.type";
import { dayJS } from "@/dayjs/day-js";

type ReturnCountries = {
  country: string;
  country_code: string;
  count: number;
  percentage: string;
}

export const countriesProcessor = (countries: z.infer<typeof CountriesSchema>["data"]): ReturnCountries[] => {
  const countCountries: Record<string, {
    country: string;
    country_code: string;
    count: number;
  }> = {};

  countries.forEach(country => {
    const key = `${country.country}_${country.country_code}`;
    if (country.country === "Unknown") return;
    if (!countCountries[key]) {
      countCountries[key] = {
        country: country.country,
        country_code: country.country_code,
        count: 0
      };
    }
    countCountries[key].count++;
  });

  return Object.values(countCountries).map(({ country, country_code, count }) => ({
    country,
    country_code,
    count,
    percentage: `${((count / countries.length) * 100).toFixed(2)}`
  })).sort((a, b) => b.count - a.count);
};

type ReturnCities = {
  city: string;
  country_code: string;
  count: number;
  percentage: string;
};

export const citiesProcessor = (cities: z.infer<typeof CitiesSchema>["data"]): ReturnCities[] => {
  const countCities: Record<string, { city: string; country_code: string; count: number }> = {};

  cities.forEach(city => {
    const key = `${city.city}_${city.country_code}`;
    if (city.city === "Unknown") return;
    if (!countCities[key]) {
      countCities[key] = { city: city.city, country_code: city.country_code, count: 0 };
    }
    countCities[key].count++;
  });

  const totalCount = Object.values(countCities).reduce((sum, current) => sum + current.count, 0);

  return Object.values(countCities).map(({ city, country_code, count }) => ({
    city,
    country_code,
    count,
    percentage: `${totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : 0}`
  })).sort((a, b) => b.count - a.count);
};

type ReturnRegions = {
  region: string;
  region_name: string;
  country_code: string;
  count: number;
  percentage: string;
}

export const regionsProcessor = (regions: z.infer<typeof RegionsSchema>["data"]): ReturnRegions[] => {
  const countRegions: Record<string, { region: string; region_name: string; country_code: string; count: number }> = {};

  regions.forEach(region => {
    const key = `${region.region}_${region.country_code}`;
    if (region.region === "Unknown") return;

    if (!countRegions[key]) {
      countRegions[key] = { region: region.region, region_name: region.region_name, country_code: region.country_code, count: 0 };
    }
    countRegions[key].count++;
  });

  return Object.values(countRegions).map(({ region, region_name, country_code, count }) => ({
    region,
    region_name,
    country_code,
    count,
    percentage: `${((count / regions.length) * 100).toFixed(2)}`
  })).sort((a, b) => b.count - a.count);
};

type ReturnDevices = {
  device: string;
  count: number;
  percentage: string;
}

export const devicesProcessor = (devices: z.infer<typeof DeviceSchema>["data"]): ReturnDevices[] => {
  const countDevices: Record<string, { device: string; count: number }> = {};

  devices.forEach(device => {
    const key = device.device;
    if (device.device === "Unknown") return;

    if (!countDevices[key]) {
      countDevices[key] = { device: device.device, count: 0 };
    }
    countDevices[key].count++;
  });

  const totalCount = Object.values(countDevices).reduce((sum, current) => sum + current.count, 0);

  return Object.values(countDevices).map(({ device, count }) => ({
    device,
    count,
    percentage: `${totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : 0}`
  })).sort((a, b) => b.count - a.count);
};

type ReturnBrowsers = {
  browser: string;
  count: number;
  percentage: string;
}

export const browsersProcessor = (browsers: z.infer<typeof BrowserSchema>["data"]): ReturnBrowsers[] => {
  const countBrowsers: Record<string, { browser: string; count: number }> = {};

  browsers.forEach(browser => {
    const key = browser.browser;
    if (browser.browser === "Unknown") return;

    if (!countBrowsers[key]) {
      countBrowsers[key] = { browser: browser.browser, count: 0 };
    }
    countBrowsers[key].count++;
  });

  const totalCount = Object.values(countBrowsers).reduce((sum, current) => sum + current.count, 0);

  return Object.values(countBrowsers).map(({ browser, count }) => ({
    browser,
    count,
    percentage: `${totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : 0}`
  })).sort((a, b) => b.count - a.count);
};

type ReturnOSs = {
  os: string;
  count: number;
  percentage: string;
}

export const osProcessor = (os: z.infer<typeof OsSchema>["data"]): ReturnOSs[] => {
  const countOSs: Record<string, { os: string; count: number }> = {};

  os.forEach(os => {
    const key = os.os;
    if (os.os === "Unknown") return;

    if (!countOSs[key]) {
      countOSs[key] = { os: os.os, count: 0 };
    }
    countOSs[key].count++;
  });

  const totalCount = Object.values(countOSs).reduce((sum, current) => sum + current.count, 0);

  return Object.values(countOSs).map(({ os, count }) => ({
    os,
    count,
    percentage: `${totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : 0}`
  })).sort((a, b) => b.count - a.count);
};

export const requestsProcessor = (
  requests: z.infer<typeof RequestsSchema>["data"],
  regroupBy: "hour" | "day" | "month" | "year"
): Record<string, number> => {
  const results: Record<string, number> = {};

  requests.forEach(request => {
    let key: string;
    const date = dayJS(request.isoDate);

    let startMinute: string;
    let endMinute: string;
    let endHour: string;

    switch (regroupBy) {
      case "hour":
        startMinute = date.minute() < 30 ? "00" : "30";
        endMinute = startMinute === "00" ? "30" : "00";
        endHour = endMinute === "00" ? date.add(1, "hour").format("h A") : date.format("h A");
        key = `${date.format("h A")} - ${endHour}`;
        break;
      case "day":
        // Clé sous la forme 'Jan 01'
        key = date.format("MMM DD");
        break;
      case "month":
        // Clé sous la forme 'Jan 2024'
        key = date.format("MMM YYYY");
        break;
      case "year":
        // Clé simple comme '2024'
        key = date.format("YYYY");
        break;
      default:
        throw new Error("Invalid regroup option");
    }

    if (results[key]) {
      results[key] += request.views;
    } else {
      results[key] = request.views;
    }
  });

  return results;
};