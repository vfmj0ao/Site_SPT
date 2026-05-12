import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductBySlug } from "@/app/actions/products";
import { formatBrlFromCents } from "@/lib/money";

type Props = { params: Promise<{ slug: string }> };

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
        ← Catálogo
      </Link>
      <article className="max-w-xl space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{product.name}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{product.description}</p>
        <div className="flex flex-wrap items-baseline gap-4">
          <span className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
            {formatBrlFromCents(product.priceCents)}
          </span>
          <span className="text-sm text-zinc-500">
            Estoque:{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">{product.stock}</strong>
          </span>
        </div>
        <div className="max-w-xs">
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            priceCents={product.priceCents}
            stock={product.stock}
          />
        </div>
      </article>
    </div>
  );
}
