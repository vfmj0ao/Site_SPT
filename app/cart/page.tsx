"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart-context";
import { formatBrlFromCents } from "@/lib/money";

export default function CartPage() {
  const { lines, setQuantity, removeLine, totalCents } = useCart();

  if (lines.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Carrinho</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Seu carrinho está vazio.</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Carrinho</h1>
      <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {lines.map((l) => (
          <li
            key={l.productId}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{l.name}</p>
              <p className="text-sm text-zinc-500">
                {formatBrlFromCents(l.priceCents)} cada
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                Qtd
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={l.quantity}
                  onChange={(e) =>
                    setQuantity(l.productId, Number.parseInt(e.target.value, 10) || 0)
                  }
                  className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </label>
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Subtotal: {formatBrlFromCents(l.priceCents * l.quantity)}
              </span>
              <button
                type="button"
                onClick={() => removeLine(l.productId)}
                className="text-sm text-red-600 hover:underline dark:text-red-400"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col items-start justify-between gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Total: {formatBrlFromCents(totalCents)}
        </p>
        <Link
          href="/checkout"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Finalizar compra
        </Link>
      </div>
    </div>
  );
}
