"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/lib/cart-context";
import { SPT_ACRONYM } from "@/lib/spt-copy";

export function Header() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const isVendedor = pathname.startsWith("/vendedor");

  const tab = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={
        active
          ? "rounded-lg bg-zinc-900 px-2.5 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900"
          : "rounded-lg px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
      }
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto max-w-5xl space-y-2 px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            TechStore SPT
          </Link>
          <div className="flex flex-wrap items-center gap-1 text-xs font-medium">
            <span className="mr-1 text-zinc-500">{SPT_ACRONYM}:</span>
            {tab("/", "Cliente", !isVendedor)}
            {tab("/vendedor", "Vendedor", isVendedor)}
            <Link
              href="/como-funciona"
              className="rounded-lg px-2.5 py-1 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
            >
              Fluxo completo
            </Link>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">
            Catálogo
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white"
          >
            Carrinho
            {totalQuantity > 0 ? (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white">
                {totalQuantity}
              </span>
            ) : null}
          </Link>
          <Link href="/pedidos" className="hover:text-zinc-900 dark:hover:text-white">
            Meus pedidos
          </Link>
        </nav>
      </div>
    </header>
  );
}
