"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function VendedorNav() {
  const pathname = usePathname();

  const link = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        href={href}
        className={
          active
            ? "rounded-lg bg-indigo-600 px-3 py-1.5 text-white"
            : "rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        }
      >
        {label}
      </Link>
    );
  };

  async function logout() {
    await fetch("/api/vendedor/logout", { method: "POST" });
    window.location.href = "/vendedor/login";
  }

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2 text-sm font-medium">
        {link("/vendedor", "Painel")}
        {link("/vendedor/produtos", "Produtos")}
        {link("/vendedor/pedidos", "Pedidos")}
        {link("/vendedor/relatorio", "Relatório")}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Ver loja (cliente)
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          Sair do modo vendedor
        </button>
      </div>
    </div>
  );
}
