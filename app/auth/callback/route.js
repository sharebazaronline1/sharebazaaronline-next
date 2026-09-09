// app/auth/callback/route.js

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const ref = searchParams.get("ref");

  console.log("=================================");
  console.log("AUTH CALLBACK HIT");
  console.log("Code:", !!code);
  console.log("Referral:", ref);
  console.log("=================================");

  if (!code) {
    console.error("No OAuth code");

    return NextResponse.redirect(
      `${origin}/login?error=no_code`
    );
  }

  const supabase = await createClient();

  const { data, error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("CODE EXCHANGE ERROR:", error);

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  console.log(
    "OAuth user:",
    data?.session?.user?.id
  );

  const response = NextResponse.redirect(
    `${origin}/dashboard`
  );

  if (ref) {
    response.cookies.set("pending_referral", ref, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}