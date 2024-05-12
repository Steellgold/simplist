/* eslint-disable camelcase */
import type { z } from "zod";
import type { CitiesSchema, CountriesSchema, RegionsSchema, RequestsSchema } from "../../app/api/user/projects/post/analytics.type";
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
  }));
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
  }));
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
  }));
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