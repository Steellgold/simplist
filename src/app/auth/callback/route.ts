import { db } from "@/utils/db/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const GET = async({ url }: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const user = (await supabase.auth.getUser()).data.user;

    console.log("User:", user?.user_metadata);

    let firstName = "";
    let lastName = "";

    if (user?.user_metadata.name) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const [first, last] = user?.user_metadata.name.split(" ") || ["", ""];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      firstName = first;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      lastName = last;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      firstName = user?.user_metadata?.user_name || "";
      lastName = "";
    }

    if (user) {
      const userExists = await db.user.findUnique({
        where: { email: user.email! }
      });

      if (!userExists) {
        await db.user.create({
          data: {
            id: user.id,
            email: user.email!,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            firstName: firstName || "",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            lastName: lastName || ""
          }
        });
      }
    }
  }

  revalidatePath("/");
  return NextResponse.redirect(origin);
};