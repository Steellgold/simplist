/* eslint-disable camelcase */
import { z } from "zod";

export type Analytics = {
  cities: Cities["data"];
  countries: Countries["data"];
  regions: Regions["data"];
}

export const CitiesSchema = z.object({
  meta: z.array(z.object({
    name: z.string(),
    type: z.string()
  })),
  data: z.array(z.object({
    year: z.number(),
    month: z.number(),
    week_start: z.string(),
    isoDate: z.string(),
    city: z.string(),
    country_code: z.string(),
    count: z.number()
  })),
  rows: z.number(),
  statistics: z.object({
    elapsed: z.number(),
    rows_read: z.number(),
    bytes_read: z.number()
  })
});

export const CountriesSchema = z.object({
  meta: z.array(z.object({
    name: z.string(),
    type: z.string()
  })),
  data: z.array(z.object({
    year: z.number(),
    month: z.number(),
    week_start: z.string(),
    country_name: z.string(),
    isoDate: z.string(),
    country_code: z.string(),
    country: z.string(),
    country_code_iso3: z.string()
  })),
  rows: z.number(),
  statistics: z.object({
    elapsed: z.number(),
    rows_read: z.number(),
    bytes_read: z.number()
  })
});

export const RegionsSchema = z.object({
  meta: z.array(z.object({
    name: z.string(),
    type: z.string()
  })),
  data: z.array(z.object({
    year: z.number(),
    month: z.number(),
    week_start: z.string(),
    region: z.string(),
    country_code: z.string(),
    isoDate: z.string()
  })),
  rows: z.number(),
  statistics: z.object({
    elapsed: z.number(),
    rows_read: z.number(),
    bytes_read: z.number()
  })
});

export type Cities = z.infer<typeof CitiesSchema>;
export type Countries = z.infer<typeof CountriesSchema>;
export type Regions = z.infer<typeof RegionsSchema>;