/* eslint-disable camelcase */
import { z } from "zod";

export type Analytics = {
  cities: Cities["data"];
  countries: Countries["data"];
  regions: Regions["data"];
  devices: Device["data"];
  browsers: Browser["data"];
  OSs: Os["data"];
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
    isoDate: z.string(),
    country_code: z.string(),
    country: z.string()
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
    region_name: z.string(),
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

export const DeviceSchema = z.object({
  meta: z.array(z.object({
    name: z.string(),
    type: z.string()
  })),
  data: z.array(z.object({
    year: z.number(),
    month: z.number(),
    week_start: z.string(),
    device: z.string(),
    count: z.number()
  })),
  rows: z.number(),
  statistics: z.object({
    elapsed: z.number(),
    rows_read: z.number(),
    bytes_read: z.number()
  })
});

export const OsSchema = z.object({
  meta: z.array(z.object({
    name: z.string(),
    type: z.string()
  })),
  data: z.array(z.object({
    year: z.number(),
    month: z.number(),
    week_start: z.string(),
    os: z.string(),
    count: z.number()
  })),
  rows: z.number(),
  statistics: z.object({
    elapsed: z.number(),
    rows_read: z.number(),
    bytes_read: z.number()
  })
});

export const BrowserSchema = z.object({
  meta: z.array(z.object({
    name: z.string(),
    type: z.string()
  })),
  data: z.array(z.object({
    year: z.number(),
    month: z.number(),
    week_start: z.string(),
    browser: z.string(),
    count: z.number()
  })),
  rows: z.number(),
  statistics: z.object({
    elapsed: z.number(),
    rows_read: z.number(),
    bytes_read: z.number()
  })
});

export const RequestsSchema = z.object({
  meta: z.array(z.object({
    name: z.string(),
    type: z.string()
  })),
  data: z.array(z.object({
    isoDate: z.string(),
    views: z.number()
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

export type Device = z.infer<typeof DeviceSchema>;
export type Os = z.infer<typeof OsSchema>;
export type Browser = z.infer<typeof BrowserSchema>;

export type Requests = z.infer<typeof RequestsSchema>;