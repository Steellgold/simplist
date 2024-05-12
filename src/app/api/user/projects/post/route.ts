/* eslint-disable camelcase */
import { env } from "@/env.mjs";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Analytics } from "./analytics.type";
import { BrowserSchema, CitiesSchema, CountriesSchema, DeviceSchema, OsSchema, RegionsSchema } from "./analytics.type";
import { tinybirdRequest } from "../../../tinybird.utils";


export const GET = async({ nextUrl }: NextRequest): Promise<NextResponse> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized", projects: null }, { status: 401 });

  const params = nextUrl.searchParams;
  const projectId = params.get("projectId");
  const postId = params.get("postId");
  if (!projectId) return NextResponse.json({ error: "Project ID is required", projects: null }, { status: 400 });
  if (!postId) return NextResponse.json({ error: "Post ID is required", projects: null }, { status: 400 });

  const post = await db.post.findUnique({
    where: {
      id: postId
    },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      banner: true,
      createdAt: true,
      updatedAt: true,
      lang: true,
      metadata: true,
      status: true,
      comments: {
        select: {
          id: true,
          content: true,
          name: true,
          createdAt: true
        }
      },
      variants: {
        select: {
          id: true,
          lang: true,
          content: true,
          excerpt: true,
          title: true
        }
      }
    }
  });

  const analytics: Analytics = {
    cities: [],
    countries: [],
    regions: [],
    devices: [],
    browsers: [],
    OSs: []
  };

  const citiesSchema = CitiesSchema.safeParse(await tinybirdRequest("cities", { projectId, postId }, env.TINYBIRD_BEARER_TOKEN));
  if (!citiesSchema.success) analytics.cities = [];
  else analytics.cities = citiesSchema.data.data;

  const countriesSchema = CountriesSchema.safeParse(await tinybirdRequest("countries", { projectId, postId }, env.TINYBIRD_BEARER_TOKEN));
  if (!countriesSchema.success) analytics.countries = [];
  else analytics.countries = countriesSchema.data.data;

  const regionsSchema = RegionsSchema.safeParse(await tinybirdRequest("regions", { projectId, postId }, env.TINYBIRD_BEARER_TOKEN));
  if (!regionsSchema.success) analytics.regions = [];
  else analytics.regions = regionsSchema.data.data;

  const deviceSchema = DeviceSchema.safeParse(await tinybirdRequest("ua_device", { projectId, postId }, env.TINYBIRD_BEARER_TOKEN));
  if (!deviceSchema.success) analytics.devices = [];
  else analytics.devices = deviceSchema.data.data;

  const browserSchema = BrowserSchema.safeParse(await tinybirdRequest("ua_browser", { projectId, postId }, env.TINYBIRD_BEARER_TOKEN));
  if (!browserSchema.success) analytics.browsers = [];
  else analytics.browsers = browserSchema.data.data;

  const osSchema = OsSchema.safeParse(await tinybirdRequest("ua_os", { projectId, postId }, env.TINYBIRD_BEARER_TOKEN));
  if (!osSchema.success) analytics.OSs = [];
  else analytics.OSs = osSchema.data.data;

  return NextResponse.json({ post, analytics }, { status: 200 });
};