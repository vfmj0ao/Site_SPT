"use client";

import { useEffect, useRef, useState } from "react";

import { useCart } from "@/lib/cart-context";

type Props = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  stock: number;
};

const FEEDBACK_MS = 2200;

export function AddToCartButton({ productId, slug, name, priceCents, stock }: Props) {
  const { addItem } = useCart();
  const disabled = stock <= 0;
  const [showAdded, setShowAdded] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function handleAdd() {
    if (disabled) return;
    addItem({ productId, slug, name, priceCents }, 1);
    setShowAdded(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowAdded(false), FEEDBACK_MS);
  }

  const added = showAdded && !disabled;

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        aria-busy={added}
        className={
          added
            ? "w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-md ring-2 ring-emerald-400/80 ring-offset-2 ring-offset-white transition dark:bg-emerald-500 dark:ring-emerald-300/50 dark:ring-offset-zinc-950"
            : "w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        }
      >
        {disabled ? "Indisponível" : added ? "✓ Adicionado ao carrinho" : "Adicionar ao carrinho"}
      </button>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {added ? `${name} adicionado ao carrinho.` : ""}
      </p>
    </div>
  );
}
