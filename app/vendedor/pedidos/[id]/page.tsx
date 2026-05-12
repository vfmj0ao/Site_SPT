import Link from "next/link";
import { notFound } from "next/navigation";

import { getSellerOrderById } from "@/app/actions/seller";
import { formatBrlFromCents } from "@/lib/money";

type Props = { params: Promise<{ id: string }> };

export default async function VendedorPedidoDetalhePage({ params }: Props) {
  const { id } = await params;
  const data = await getSellerOrderById(id);
  if (!data) notFound();

  const { order, items } = data;

  return (
    <div className="space-y-4">
      <Link href="/vendedor/pedidos" className="text-sm text-indigo-600 underline dark:text-indigo-400">
        ← Todos os pedidos
      </Link>
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Pedido #{order.id.slice(0, 8)}
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {order.customerName} · {order.customerEmail}
      </p>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {items.map((it, i) => (
          <li key={i} className="flex justify-between gap-2 px-3 py-2 text-sm">
            <span>
              {it.productName} × {it.quantity}
            </span>
            <span>{formatBrlFromCents(it.unitPriceCents * it.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Total: {formatBrlFromCents(order.totalCents)}
      </p>
    </div>
  );
}
