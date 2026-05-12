import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SELLER_SESSION_COOKIE } from "@/lib/seller-session";

export async function POST() {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(SELLER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
