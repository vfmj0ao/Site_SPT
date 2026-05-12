"use client";

import { useCart } from "@/lib/cart-context";

type Props = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  stock: number;
};

export function AddToCartButton({ productId, slug, name, priceCents, stock }: Props) {
  const { addItem } = useCart();
  const disabled = stock <= 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => addItem({ productId, slug, name, priceCents }, 1)}
      className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
    >
      {disabled ? "Indisponível" : "Adicionar ao carrinho"}
    </button>
  );
}
