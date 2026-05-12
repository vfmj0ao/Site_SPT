import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const expected = process.env.VENDEDOR_PIN?.trim();

  let body: { pin?: string } = {};
  try {
    body = (await request.json()) as { pin?: string };
  } catch {
    body = {};
  }

  if (!expected) {
    const store = await cookies();
    store.set("tpo_vendedor", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return NextResponse.json({
      ok: true,
      warning:
        "VENDEDOR_PIN não definido: painel aberto só para desenvolvimento. Defina o PIN em produção.",
    });
  }

  if (body.pin === expected) {
    const store = await cookies();
    store.set("tpo_vendedor", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
      secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "PIN incorreto." }, { status: 401 });
}
