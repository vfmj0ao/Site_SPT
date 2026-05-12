"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VendedorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/vendedor";
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/vendedor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; warning?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Falha no login.");
        return;
      }
      if (data.warning) {
        console.warn(data.warning);
      }
      router.push(next.startsWith("/vendedor") ? next : "/vendedor");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Modo vendedor</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Acesso ao painel do SPT. Se definires a variável{" "}
        <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">VENDEDOR_PIN</code> no
        ambiente, precisas do PIN; caso contrário (só desenvolvimento), qualquer submissão entra.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          PIN
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "A entrar…" : "Entrar"}
        </button>
      </form>
      <Link href="/" className="block text-center text-sm text-indigo-600 underline dark:text-indigo-400">
        Voltar à loja
      </Link>
    </div>
  );
}

export default function VendedorLoginPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm text-zinc-500">A carregar…</p>}>
      <VendedorLoginForm />
    </Suspense>
  );
}
