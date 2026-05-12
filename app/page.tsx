import { getProducts } from "@/app/actions/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SptFlowExplainer } from "@/components/SptFlowExplainer";
import type { Product } from "@/db/schema";
import { SPT_ACRONYM, SPT_FULL_NAME } from "@/lib/spt-copy";

export default async function HomePage() {
  let products: Product[] = [];
  let loadError: string | null = null;
  try {
    products = await getProducts();
  } catch (e) {
    loadError =
      e instanceof Error ? e.message : "Não foi possível ligar à base de dados.";
    products = [];
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Catálogo (modo cliente)
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-800 dark:text-zinc-200">{SPT_ACRONYM}</strong> (
          {SPT_FULL_NAME}): no checkout, o servidor executa uma{" "}
          <strong className="font-medium text-zinc-800 dark:text-zinc-200">
            transação no PostgreSQL
          </strong>{" "}
          que valida estoque, grava o pedido e baixa o stock de forma atômica (tudo ou nada). Em
          inglês o mesmo conceito costuma chamar-se <strong>TPS</strong>.
        </p>
      </div>
      <SptFlowExplainer />
      <ProductGrid products={products} loadError={loadError} />
    </div>
  );
}
