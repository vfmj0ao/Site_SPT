import Link from "next/link";

import { getSellerOrders } from "@/app/actions/seller";
import { formatBrlFromCents } from "@/lib/money";

export default async function VendedorPedidosPage() {
  let rows;
  try {
    rows = await getSellerOrders();
  } catch {
    return <p className="text-sm text-red-600">Sem acesso ao painel do vendedor.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Lista de documentos comerciais (pedidos) já persistidos — útil para conferência e relatórios.
      </p>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Cliente</th>
              <th className="px-3 py-2">E-mail</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-zinc-500">
                  Nenhum pedido.
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id}>
                  <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(o.createdAt))}
                  </td>
                  <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-50">
                    {o.customerName}
                  </td>
                  <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">{o.customerEmail}</td>
                  <td className="px-3 py-2 text-right font-medium text-emerald-700 dark:text-emerald-400">
                    {formatBrlFromCents(o.totalCents)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      href={`/vendedor/pedidos/${o.id}`}
                      className="text-indigo-600 underline dark:text-indigo-400"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
