import Link from "next/link";

import { getProducts } from "@/app/actions/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SptFlowExplainer } from "@/components/SptFlowExplainer";
import type { Product } from "@/db/schema";
import {
  SPT_ACRONYM,
  SPT_FULL_NAME,
  SPT_PARALLEL_ENGLISH_NAME,
  SPT_WHAT_IS,
} from "@/lib/spt-copy";

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
          {SPT_WHAT_IS}
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          No <strong className="text-zinc-800 dark:text-zinc-200">checkout</strong>, o servidor
          executa uma{" "}
          <strong className="font-medium text-zinc-800 dark:text-zinc-200">
            única transação PostgreSQL
          </strong>{" "}
          que valida stock, grava o pedido e as linhas de forma atómica (tudo ou nada). Em inglês,
          este paradigma alinha-se a um <strong>{SPT_PARALLEL_ENGLISH_NAME}</strong>; aqui usamos{" "}
          <strong>{SPT_ACRONYM}</strong> ({SPT_FULL_NAME}).
        </p>
        <p className="text-sm">
          <Link
            href="/como-funciona"
            className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
          >
            Guia completo: fases do SPT, ACID, passos no checkout e onde está no código
          </Link>
        </p>
      </div>
      <SptFlowExplainer />
      <ProductGrid products={products} loadError={loadError} />
    </div>
  );
}
