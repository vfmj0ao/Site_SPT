import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrderById } from "@/app/actions/orders";
import { formatBrlFromCents } from "@/lib/money";

type Props = { params: Promise<{ id: string }> };

export default async function PedidoPage({ params }: Props) {
  const { id } = await params;
  const data = await getOrderById(id);
  if (!data) notFound();

  const { order, items } = data;
  const created = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(order.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">Pedido confirmado</p>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Pedido #{order.id.slice(0, 8)}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{created}</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">{order.customerName}</span>
          {" · "}
          {order.customerEmail}
        </p>
        <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((it, idx) => (
            <li key={idx} className="flex justify-between gap-2 py-2 text-sm">
              <span className="text-zinc-800 dark:text-zinc-200">
                {it.productName} × {it.quantity}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {formatBrlFromCents(it.unitPriceCents * it.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-zinc-200 pt-4 text-base font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
          Total pago: {formatBrlFromCents(order.totalCents)}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/" className="text-emerald-700 underline dark:text-emerald-400">
          Continuar comprando
        </Link>
        <Link
          href={`/pedidos?email=${encodeURIComponent(order.customerEmail)}`}
          className="text-zinc-600 underline dark:text-zinc-400"
        >
          Ver meus pedidos
        </Link>
      </div>
    </div>
  );
}
