/* eslint-disable camelcase */
import { env } from "@/env.mjs";
import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Analytics } from "./analytics.type";
import { CitiesSchema, CountriesSchema, RegionsSchema } from "./analytics.type";


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
    regions: []
  };

  const citiesUrl = new URL("https://api.tinybird.co/v0/pipes/cities.json");
  const countriesUrl = new URL("https://api.tinybird.co/v0/pipes/countries.json");
  const regionsUrl = new URL("https://api.tinybird.co/v0/pipes/regions.json");
  citiesUrl.searchParams.append("projectId", projectId);
  countriesUrl.searchParams.append("projectId", projectId);
  regionsUrl.searchParams.append("projectId", projectId);
  citiesUrl.searchParams.append("postId", postId);
  countriesUrl.searchParams.append("postId", postId);
  regionsUrl.searchParams.append("postId", postId);

  const headers = { Authorization: `Bearer ${env.TINYBIRD_BEARER_TOKEN}` };

  const citiesRes = await fetch(citiesUrl.toString(), { headers });
  const citiesSchema = CitiesSchema.safeParse(await citiesRes.json());
  if (!citiesSchema.success) {
    analytics.cities = [];
  } else analytics.cities = citiesSchema.data.data;

  const countriesRes = await fetch(countriesUrl.toString(), { headers });
  const countriesSchema = CountriesSchema.safeParse(await countriesRes.json());
  if (!countriesSchema.success) {
    analytics.countries = [];
  } else analytics.countries = countriesSchema.data.data;

  const regionsRes = await fetch(regionsUrl.toString(), { headers });
  const regionsSchema = RegionsSchema.safeParse(await regionsRes.json());
  if (!regionsSchema.success) {
    analytics.regions = [];
  } else analytics.regions = regionsSchema.data.data;

  return NextResponse.json({ post, analytics }, { status: 200 });
};