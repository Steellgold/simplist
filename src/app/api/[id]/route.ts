/* eslint-disable camelcase */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/utils/db/prisma";
import type { Variant } from "@prisma/client";
import { Lang, type APIKey, type Post, type Project } from "@prisma/client";
import type { IPAPIResponse } from "../ipapi.type";
import { env } from "@/env.mjs";
import { dayJS } from "@/dayjs/day-js";

type Request = {
  params: {
    id: string;
  };
};

export const GET = async({ headers, nextUrl }: NextRequest, { params }: Request): Promise<NextResponse> => {
  const postId = params.id;
  if (!postId) return NextResponse.json({ message: "Not Found" }, { status: 404 });

  const key = headers.get("x-api-key");
  if (!key) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const keyData = await db.$queryRaw<APIKey[]>`SELECT * FROM "APIKey" WHERE "key" = ${key} AND "status" = 'ACTIVE' LIMIT 1`;
  if (keyData.length == 0) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const activeKey = keyData[0];

  const project = await db.$queryRaw<Project[]>`SELECT * FROM "Project" WHERE "id" = ${activeKey.projectId} LIMIT 1`;
  if (project.length == 0) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  const activeProject = project[0];

  const post = await db.$queryRaw<Post[]>`SELECT * FROM "Post" WHERE "id" = ${postId} AND "projectId" = ${activeProject.id}`;
  if (post.length == 0) return NextResponse.json({ message: "Not Found" }, { status: 404 });

  const activePost: Post = post[0];
  const variants: Variant[] = [];

  const spVariants = nextUrl.searchParams.get("variants");
  if (spVariants) {
    const tempVariants = await db.$queryRaw<Variant[]>`SELECT * FROM "Variant" WHERE "parentId" = ${activePost.id} LIMIT 10`;
    console.log(tempVariants);
    console.log(`Found ${tempVariants.length} variant(s) for post ${activePost.id}`);

    switch (spVariants) {
      case "true":
        console.log("User want to get all variants");
        variants.push(...tempVariants);
        break;
      default:
        console.log("User want to get specific(s) variant(s)", spVariants);

        for (const v of spVariants.split(",")) {
          if (!v) continue;
          if (Object.values(Lang).includes(v as Lang)) {
            const variant = tempVariants.find((x) => x.lang == v);
            if (variant) variants.push(variant);
          } else {
            console.log(`Invalid variant lang: ${v}`);
          }
        }
        break;
    }
  }

  let local: IPAPIResponse | undefined = undefined;
  let ipAddr = headers.get("x-user-ip");

  const ips = [ // Recovered by connecting to different locations via VPN
    "185.94.189.214", // France
    "185.187.214.87", // Monaco
    "79.98.183.224", // Barcelone
    "195.181.167.229", // Spain
    "62.100.211.58", // United Kingdom
    "149.143.179.25", // Island
    "138.99.145.17" // Brazil
  ];

  if (ipAddr) {
    if (env.NEXT_PUBLIC_ENVIRONMENT == "dev" && ipAddr == "dev") {
      ipAddr = ips[Math.floor(Math.random() * ips.length)];
    }

    if (ipAddr.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      local = await fetch(
        `http://ip-api.com/json/${ipAddr}?fields=continentCode,country,countryCode,region,regionName,city,query`
      ).then((res) => res.json() as Promise<IPAPIResponse>);
    } else {
      return NextResponse.json({ message: "Invalid IP Address" }, { status: 400 });
    }
  }

  const date = env.NEXT_PUBLIC_ENVIRONMENT == "prod" ? dayJS() : dayJS()
    .subtract(Math.floor(Math.random() * 30), "days")
    .hour(Math.floor(Math.random() * 24))
    .minute(Math.floor(Math.random() * 60))
    .month(Math.floor(Math.random() * 12))
    .year(Math.floor(Math.random() * 3) + 2020);

  await fetch("https://api.tinybird.co/v0/events?name=posts_metrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.TINYBIRD_BEARER_TOKEN}`
    },
    body: JSON.stringify({
      projectId: activeProject.id,
      postId,
      dateTime: date.format("YYYY-MM-DD HH:MM:ss"),
      date: date.format("YYYY-MM-DD"),
      isoDate: date.toISOString(),
      ip: ipAddr,

      city: local?.city || "Unknown",

      region: local?.region || "Unknown",
      region_name: local?.regionName || "Unknown",

      country: local?.country || "Unknown",
      country_code: local?.countryCode || "Unknown",

      in_eu: local?.continentCode == "EU" ? 1 : 0
    })
  });

  return NextResponse.json({
    post: {
      ...activePost,
      variants: spVariants ? variants : undefined
    }
  });
};