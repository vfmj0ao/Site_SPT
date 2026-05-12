import Link from "next/link";

import { getSellerOverview } from "@/app/actions/seller";
import { formatBrlFromCents } from "@/lib/money";
import { SPT_ACRONYM, SPT_FULL_NAME } from "@/lib/spt-copy";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export default async function VendedorDashboardPage() {
  let data;
  try {
    data = await getSellerOverview();
  } catch {
    return (
      <p className="text-sm text-red-700 dark:text-red-300">
        Não foi possível carregar o painel. Confirme sessão em{" "}
        <a href="/vendedor/login" className="underline">
          /vendedor/login
        </a>
        .
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <p className="rounded-xl border border-amber-200/80 bg-white/80 p-3 text-sm leading-relaxed text-zinc-700 dark:border-amber-900/40 dark:bg-zinc-950/60 dark:text-zinc-300">
        No painel do vendedor vês a face <strong className="text-zinc-900 dark:text-zinc-100">edição</strong>,{" "}
        <strong className="text-zinc-900 dark:text-zinc-100">armazenamento</strong> e{" "}
        <strong className="text-zinc-900 dark:text-zinc-100">relatórios</strong> do{" "}
        {SPT_ACRONYM} ({SPT_FULL_NAME}): ajustes de stock com motivo, pedidos recentes e exportação
        para análise. Cada alteração de stock persistida é tratada como transação com registo de auditoria.
      </p>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase text-zinc-500">Pedidos (total)</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {data.orderCount}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase text-zinc-500">Receita acumulada</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {formatBrlFromCents(data.revenueCents)}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium uppercase text-zinc-500">Stock baixo (≤5)</p>
          <p className="mt-1 text-2xl font-bold text-amber-800 dark:text-amber-300">
            {data.lowStock.length}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Últimos pedidos (produção de documento comercial)
          </h2>
          <ul className="mt-2 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {data.recentOrders.length === 0 ? (
              <li className="p-3 text-sm text-zinc-500">Ainda não há pedidos.</li>
            ) : (
              data.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-2 p-3 text-sm">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {o.customerName}
                    </p>
                    <p className="text-xs text-zinc-500">{fmtDate(new Date(o.createdAt))}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatBrlFromCents(o.totalCents)}
                    </p>
                    <Link
                      href={`/vendedor/pedidos/${o.id}`}
                      className="text-xs text-indigo-600 underline dark:text-indigo-400"
                    >
                      Detalhe
                    </Link>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Últimas correções de stock (auditoria)
          </h2>
          <ul className="mt-2 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
            {data.recentAdjustments.length === 0 ? (
              <li className="p-3 text-sm text-zinc-500">Sem ajustes registados.</li>
            ) : (
              data.recentAdjustments.map((a) => (
                <li key={a.id} className="p-3 text-sm">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {a.productName}: {a.previousStock} → {a.newStock}
                  </p>
                  <p className="text-xs text-zinc-500">{a.reason}</p>
                  <p className="text-xs text-zinc-400">{fmtDate(new Date(a.createdAt))}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
