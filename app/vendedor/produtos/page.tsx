import { getSellerProducts } from "@/app/actions/seller";
import { SellerProductsManager } from "@/components/SellerProductsManager";

export default async function VendedorProdutosPage() {
  let products;
  try {
    products = await getSellerProducts();
  } catch {
    return <p className="text-sm text-red-600">Sem acesso ao painel do vendedor.</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Aqui concretiza-se a fase de <strong>edição / manipulação / correção</strong> do SPT: cada
        alteração de stock gera um registo em <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">stock_adjustments</code>{" "}
        na mesma transação que atualiza o produto.
      </p>
      <SellerProductsManager products={products} />
    </div>
  );
}
