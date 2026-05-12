import Link from "next/link";

import { AddToCartButton } from "@/components/AddToCartButton";
import { formatBrlFromCents } from "@/lib/money";
import type { Product } from "@/db/schema";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        Nenhum produto cadastrado. Rode{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm dark:bg-zinc-800">
          npm run db:push
        </code>{" "}
        e{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm dark:bg-zinc-800">
          npm run db:seed
        </code>
        .
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li
          key={p.id}
          className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {p.name}
              </h2>
              <p className="mt-1 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                {p.description}
              </p>
            </div>
          </div>
          <div className="mt-auto space-y-3 pt-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                {formatBrlFromCents(p.priceCents)}
              </span>
              <span className="text-zinc-500">
                Estoque: <span className="font-medium text-zinc-800 dark:text-zinc-200">{p.stock}</span>
              </span>
            </div>
            <AddToCartButton
              productId={p.id}
              slug={p.slug}
              name={p.name}
              priceCents={p.priceCents}
              stock={p.stock}
            />
            <Link
              href={`/produto/${p.slug}`}
              className="block text-center text-sm text-zinc-500 underline-offset-4 hover:text-zinc-800 hover:underline dark:hover:text-zinc-200"
            >
              Detalhes
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
