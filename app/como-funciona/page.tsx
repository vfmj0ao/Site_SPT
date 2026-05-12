import Link from "next/link";

import { SptFlowExplainer } from "@/components/SptFlowExplainer";
import {
  SPT_ACRONYM,
  SPT_FULL_NAME,
  SPT_PARALLEL_ENGLISH_NAME,
} from "@/lib/spt-copy";

export default function ComoFuncionaPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Como este site demonstra o {SPT_ACRONYM}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {SPT_FULL_NAME} ({SPT_ACRONYM}) é o conceito usado neste site; em literatura anglófona o
          mesmo tipo de sistema costuma designar-se <strong>{SPT_PARALLEL_ENGLISH_NAME}</strong>.
          Abaixo vês as fases do
          fluxo e onde cada uma acontece na aplicação.
        </p>
      </div>

      <SptFlowExplainer />

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Duas perspectivas: cliente e vendedor
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-2">Fase do {SPT_ACRONYM}</th>
                <th className="px-3 py-2">Modo cliente (loja)</th>
                <th className="px-3 py-2">Modo vendedor (painel)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              <tr>
                <td className="px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">Coleta</td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                  Catálogo, carrinho, formulário de checkout.
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                  Formulários de correção de stock e edição de produto.
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">
                  Edição / correção
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                  Validação no servidor (Zod) antes de gravar o pedido.
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                  Ajuste de stock com motivo; alteração de nome/preço/descrição.
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">
                  Armazenamento
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400" colSpan={2}>
                  PostgreSQL (Neon): tabelas de produtos, pedidos, itens e{" "}
                  <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">
                    stock_adjustments
                  </code>
                  .
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">
                  Processamento
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400" colSpan={2}>
                  Transação única no checkout; transação no ajuste de stock + auditoria.
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">
                  Relatórios
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                  Comprovante do pedido, página &quot;Meus pedidos&quot;.
                </td>
                <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                  Painel, lista de pedidos, relatório com impressão e CSV.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-sm text-zinc-500">
        <Link href="/" className="text-indigo-600 underline dark:text-indigo-400">
          Voltar ao catálogo
        </Link>
        {" · "}
        <Link href="/vendedor" className="text-indigo-600 underline dark:text-indigo-400">
          Abrir painel do vendedor
        </Link>
      </p>
    </div>
  );
}
