"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { sellerAdjustStock, sellerUpdateProduct } from "@/app/actions/seller";
import { formatBrlFromCents } from "@/lib/money";
import type { Product } from "@/db/schema";

type Props = { products: Product[] };

export function SellerProductsManager({ products }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {msg ? (
        <p className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {msg}
        </p>
      ) : null}

      <ul className="space-y-6">
        {products.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{p.name}</p>
                <p className="text-sm text-zinc-500">
                  Stock atual: <strong>{p.stock}</strong> · {formatBrlFromCents(p.priceCents)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-6 border-t border-zinc-100 pt-4 dark:border-zinc-800 lg:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase text-zinc-500">
                  Correção de stock (manipulação + armazenamento)
                </h3>
                <form
                  className="mt-2 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const newStock = Number.parseInt(String(fd.get("newStock")), 10);
                    const reason = String(fd.get("reason") ?? "");
                    setMsg(null);
                    startTransition(async () => {
                      const r = await sellerAdjustStock({
                        productId: p.id,
                        newStock,
                        reason,
                      });
                      setMsg(r.ok ? "Stock atualizado e registo de auditoria gravado." : r.message);
                      if (r.ok) router.refresh();
                    });
                  }}
                >
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Novo stock
                    <input
                      name="newStock"
                      type="number"
                      min={0}
                      required
                      defaultValue={p.stock}
                      className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </label>
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Motivo (mín. 3 caracteres — rastreio no SPT)
                    <input
                      name="reason"
                      required
                      minLength={3}
                      placeholder="Ex.: inventário físico, devolução fornecedor…"
                      className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-lg bg-amber-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    Gravar ajuste
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-zinc-500">
                  Edição do produto (catálogo)
                </h3>
                <form
                  className="mt-2 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const name = String(fd.get("name"));
                    const description = String(fd.get("description"));
                    const price = Number.parseFloat(String(fd.get("price")));
                    const priceCents = Math.round(price * 100);
                    setMsg(null);
                    startTransition(async () => {
                      const r = await sellerUpdateProduct({
                        productId: p.id,
                        name,
                        description,
                        priceCents,
                      });
                      setMsg(r.ok ? "Produto atualizado." : r.message);
                      if (r.ok) router.refresh();
                    });
                  }}
                >
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Nome
                    <input
                      name="name"
                      required
                      defaultValue={p.name}
                      className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </label>
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Descrição
                    <textarea
                      name="description"
                      required
                      rows={2}
                      defaultValue={p.description}
                      className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </label>
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400">
                    Preço (R$)
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min={0}
                      required
                      defaultValue={(p.priceCents / 100).toFixed(2)}
                      className="mt-1 w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                  >
                    Guardar edição
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
