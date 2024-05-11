import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const GET = async(): Promise<NextResponse> => {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) return NextResponse.json({ isLogged: false });
  return NextResponse.json({ isLogged: true });
};