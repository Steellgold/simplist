/* eslint-disable camelcase */
import type { z } from "zod";
import type { CitiesSchema, CountriesSchema, RegionsSchema } from "../../app/api/user/projects/post/analytics.type";

type ReturnCountries = {
  country: string;
  country_code: string;
  count: number;
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

  return Object.values(countCountries);
};

type ReturnCities = {
  city: string;
  country_code: string;
  count: number;
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

  return Object.values(countCities);
};

type ReturnRegions = {
  region: string;
  country_code: string;
  count: number;
}

export const regionsProcessor = (regions: z.infer<typeof RegionsSchema>["data"]): ReturnRegions[] => {
  const countRegions: Record<string, { region: string; country_code: string; count: number }> = {};

  regions.forEach(region => {
    const key = `${region.region}_${region.country_code}`;
    if (region.region === "Unknown") return;

    if (!countRegions[key]) {
      countRegions[key] = { region: region.region, country_code: region.country_code, count: 0 };
    }
    countRegions[key].count++;
  });

  return Object.values(countRegions);
};