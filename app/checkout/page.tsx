"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { placeOrder } from "@/app/actions/orders";
import { useCart } from "@/lib/cart-context";
import { formatBrlFromCents } from "@/lib/money";
import { sptCheckoutDbSteps } from "@/lib/spt-copy";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalCents, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (lines.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Checkout</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Adicione itens ao carrinho primeiro.</p>
        <Link href="/" className="text-emerald-600 underline dark:text-emerald-400">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await placeOrder({
        customerName: name,
        customerEmail: email,
        items: lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        })),
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      clear();
      router.push(`/pedido/${result.orderId}`);
    });
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Checkout</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Fase de <strong>processamento</strong> do SPT: o pedido é gravado no servidor numa única
          transação ACID no PostgreSQL (validação de stock + pedido + linhas).
        </p>
        <details className="mt-3 rounded-lg border border-indigo-200/80 bg-indigo-50/50 p-3 text-sm text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/25 dark:text-indigo-100">
          <summary className="cursor-pointer font-medium text-indigo-900 dark:text-indigo-100">
            Ver passos técnicos executados ao confirmar
          </summary>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-indigo-900/95 dark:text-indigo-100/90">
            {sptCheckoutDbSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">Resumo</p>
        <ul className="mt-2 space-y-1 text-zinc-600 dark:text-zinc-400">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-2">
              <span>
                {l.name} × {l.quantity}
              </span>
              <span>{formatBrlFromCents(l.priceCents * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-zinc-200 pt-3 text-base font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
          Total: {formatBrlFromCents(totalCents)}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Nome
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            E-mail (para localizar pedidos)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {pending ? "Processando…" : "Confirmar pedido"}
        </button>
      </form>
    </div>
  );
}
