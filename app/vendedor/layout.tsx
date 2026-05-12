import Link from "next/link";

import { VendedorNav } from "@/components/VendedorNav";
import { SPT_ACRONYM, SPT_FULL_NAME } from "@/lib/spt-copy";

export default function VendedorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-amber-50/40 p-4 dark:border-zinc-800 dark:bg-amber-950/15 sm:p-6">
      <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200/90">
            Modo vendedor · {SPT_ACRONYM}
          </p>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Painel comercial
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {SPT_FULL_NAME}: correção de stock com auditoria, edição de produtos e relatórios.
          </p>
        </div>
        <Link
          href="/como-funciona"
          className="text-sm text-indigo-700 underline dark:text-indigo-300"
        >
          Como funciona o SPT
        </Link>
      </div>
      <VendedorNav />
      {children}
    </div>
  );
}
