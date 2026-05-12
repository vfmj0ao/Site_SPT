"use client";

import { formatBrlFromCents } from "@/lib/money";

export type SellerReportPayload = {
  from: string;
  to: string;
  orderCount: number;
  revenueCents: number;
  orders: {
    id: string;
    customerName: string;
    customerEmail: string;
    totalCents: number;
    createdAt: string;
  }[];
  adjustments: {
    createdAt: string;
    productName: string;
    previousStock: number;
    newStock: number;
    reason: string;
  }[];
};

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function ReportExportBar({ report }: { report: SellerReportPayload }) {
  function downloadCsv() {
    const header = [
      "pedido_id",
      "data_iso",
      "cliente",
      "email",
      "total_centavos",
    ].join(",");
    const orderLines = report.orders.map((o) =>
      [
        o.id,
        new Date(o.createdAt).toISOString(),
        escapeCsv(o.customerName),
        escapeCsv(o.customerEmail),
        String(o.totalCents),
      ].join(",")
    );
    const adjHeader = "\n\najuste_data_iso,produto,anterior,novo,motivo";
    const adjLines = report.adjustments.map((a) =>
      [
        new Date(a.createdAt).toISOString(),
        escapeCsv(a.productName),
        String(a.previousStock),
        String(a.newStock),
        escapeCsv(a.reason),
      ].join(",")
    );
    const csvText = [[header, ...orderLines].join("\n"), adjHeader, "\n", adjLines.join("\n")].join("");
    const blob = new Blob([csvText], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-techstore-SPT-${report.from.slice(0, 10)}_${report.to.slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="no-print mb-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Imprimir relatório
      </button>
      <button
        type="button"
        onClick={downloadCsv}
        className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
      >
        Exportar CSV
      </button>
    </div>
  );
}

export function ReportPrintBody({ report }: { report: SellerReportPayload }) {
  return (
    <div id="relatorio-spt-area" className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Relatório do SPT</h2>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Período: {report.from.slice(0, 10)} a {report.to.slice(0, 10)}
      </p>
      <p className="mt-2 font-medium text-zinc-900 dark:text-zinc-50">
        Resumo: {report.orderCount} pedidos · receita {formatBrlFromCents(report.revenueCents)}
      </p>

      <h3 className="mt-6 font-semibold text-zinc-900 dark:text-zinc-50">Pedidos</h3>
      <table className="mt-2 w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="py-1 pr-2">Data</th>
            <th className="py-1 pr-2">Cliente</th>
            <th className="py-1 pr-2">E-mail</th>
            <th className="py-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {report.orders.map((o) => (
            <tr key={o.id} className="border-b border-zinc-100 dark:border-zinc-800">
              <td className="py-1 pr-2 text-zinc-600 dark:text-zinc-400">
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(o.createdAt))}
              </td>
              <td className="py-1 pr-2">{o.customerName}</td>
              <td className="py-1 pr-2">{o.customerEmail}</td>
              <td className="py-1 text-right font-medium">
                {formatBrlFromCents(o.totalCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-6 font-semibold text-zinc-900 dark:text-zinc-50">Ajustes de stock</h3>
      <ul className="mt-2 space-y-2 text-xs">
        {report.adjustments.length === 0 ? (
          <li className="text-zinc-500">Nenhum ajuste no período.</li>
        ) : (
          report.adjustments.map((a, i) => (
            <li key={i} className="border-b border-zinc-100 pb-2 dark:border-zinc-800">
              <span className="font-medium">{a.productName}</span>: {a.previousStock} → {a.newStock}
              <br />
              <span className="text-zinc-600 dark:text-zinc-400">{a.reason}</span>
              <br />
              <span className="text-zinc-400">
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(a.createdAt))}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
