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
  const ipAddr = headers.get("x-user-ip");

  if (ipAddr) {
    if (ipAddr.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      local = await fetch(`https://ipapi.co/${ipAddr}/json/`).then((res) => res.json() as Promise<IPAPIResponse>);
    } else {
      return NextResponse.json({ message: "Invalid IP Address" }, { status: 400 });
    }
  }

  await fetch("https://api.tinybird.co/v0/events?name=posts_metrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.TINYBIRD_BEARER_TOKEN}`
    },
    body: JSON.stringify({
      projectId: activeProject.id,
      postId,
      createdAt: new Date().toISOString(),
      createdAtSimplified: dayJS().format("YYYY-MM-DD"),
      ip: local?.ip || ipAddr,
      city: local?.city || "Unknown",
      region: local?.region || "Unknown",
      region_code: local?.region_code || "Unknown",
      country: local?.country || "Unknown",
      country_name: local?.country_name || "Unknown",
      country_code: local?.country_code || "Unknown",
      country_code_iso3: local?.country_code_iso3 || "Unknown",
      in_eu: local?.in_eu || false
    })
  });

  return NextResponse.json({
    post: {
      ...activePost,
      variants: spVariants ? variants : undefined
    }
  });
};