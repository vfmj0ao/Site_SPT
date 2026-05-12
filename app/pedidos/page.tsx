import Link from "next/link";

import { getOrdersByEmail } from "@/app/actions/orders";
import { formatBrlFromCents } from "@/lib/money";

type Props = { searchParams: Promise<{ email?: string }> };

export default async function PedidosPage({ searchParams }: Props) {
  const { email } = await searchParams;
  const trimmed = email?.trim() ?? "";
  const orders = trimmed ? await getOrdersByEmail(trimmed) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Meus pedidos</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Informe o mesmo e-mail usado no checkout (sem senha — apenas para demonstração).
        </p>
      </div>

      <form className="flex max-w-md flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          E-mail
          <input
            type="email"
            name="email"
            defaultValue={trimmed}
            placeholder="voce@email.com"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Buscar
        </button>
      </form>

      {!trimmed ? (
        <p className="text-sm text-zinc-500">Digite um e-mail e clique em Buscar.</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Nenhum pedido encontrado para este e-mail.
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const when = new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(o.createdAt));
            return (
              <li
                key={o.id}
                className="flex flex-col justify-between gap-2 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    Pedido #{o.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-zinc-500">{when}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {formatBrlFromCents(o.totalCents)}
                  </span>
                  <Link
                    href={`/pedido/${o.id}`}
                    className="text-sm text-zinc-600 underline dark:text-zinc-400"
                  >
                    Detalhes
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
