import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SELLER_SESSION_COOKIE } from "@/lib/seller-session";

export async function POST() {
  const store = await cookies();
  store.set(SELLER_SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
