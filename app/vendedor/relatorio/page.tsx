import { getSellerReportData } from "@/app/actions/seller";
import { ReportExportBar, ReportPrintBody, type SellerReportPayload } from "@/components/ReportExportBar";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type Props = { searchParams: Promise<{ from?: string; to?: string }> };

export default async function VendedorRelatorioPage({ searchParams }: Props) {
  const sp = await searchParams;
  const today = new Date();
  const defFrom = new Date(today);
  defFrom.setDate(defFrom.getDate() - 30);

  const toStr = sp.to && /^\d{4}-\d{2}-\d{2}$/.test(sp.to) ? sp.to : ymd(today);
  const fromStr =
    sp.from && /^\d{4}-\d{2}-\d{2}$/.test(sp.from) ? sp.from : ymd(defFrom);

  const fromIso = new Date(`${fromStr}T00:00:00`).toISOString();
  const toIso = new Date(`${toStr}T23:59:59.999`).toISOString();

  let report: SellerReportPayload;
  try {
    const raw = await getSellerReportData(fromIso, toIso);
    report = {
      ...raw,
      orders: raw.orders.map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt).toISOString(),
      })),
      adjustments: raw.adjustments.map((a) => ({
        ...a,
        createdAt: new Date(a.createdAt).toISOString(),
      })),
    };
  } catch (e) {
    return (
      <p className="text-sm text-red-600">
        {e instanceof Error ? e.message : "Erro ao gerar relatório."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Fase de <strong>documentos / relatórios</strong> do SPT: consolida pedidos e auditoria de
        stock no intervalo escolhido. Use imprimir ou CSV para entregar evidência no trabalho.
      </p>

      <form
        method="get"
        action="/vendedor/relatorio"
        className="no-print flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
      >
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          De
          <input
            type="date"
            name="from"
            defaultValue={fromStr}
            className="mt-1 block rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
          />
        </label>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Até
          <input
            type="date"
            name="to"
            defaultValue={toStr}
            className="mt-1 block rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-600 dark:bg-zinc-950"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Atualizar
        </button>
      </form>

      <ReportExportBar report={report} />
      <ReportPrintBody report={report} />
    </div>
  );
}
