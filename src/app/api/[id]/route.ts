/* eslint-disable camelcase */
import { env } from "@/env.mjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { IPAPIResponse } from "../ipapi.type";

type Request = {
  params: {
    id: string;
  };
};

export const GET = async({ headers }: NextRequest, { params }: Request): Promise<NextResponse> => {
  const slug = params.id;
  if (!slug) return NextResponse.json({ message: "Not Found" }, { status: 404 });

  const xApiKey = headers.get("x-api-key");
  if (!xApiKey) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let local: IPAPIResponse | undefined = undefined;
  const ipAddr = headers.get("X-User-IP");
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
      projectId: "events_example",
      postId: slug,
      createdAt: new Date().toISOString(),
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

  return NextResponse.json({ message: "Hello, World!" });
};