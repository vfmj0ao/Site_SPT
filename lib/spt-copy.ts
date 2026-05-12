/** Textos fixos sobre o SPT (Sistema de Processamento de Transações) — uso académico. */
export const SPT_FULL_NAME = "Sistema de Processamento de Transações";
export const SPT_ACRONYM = "SPT";

export const sptPhases = [
  {
    key: "coleta",
    title: "Coleta",
    desc: "Entrada de dados: escolha de produtos, quantidades no carrinho e dados do cliente no checkout. Tudo é revalidado no servidor.",
  },
  {
    key: "edicao",
    title: "Edição / manipulação / correção",
    desc: "Regras e ajustes antes e durante a gravação: validação (Zod), conferência de estoque e, no painel do vendedor, correção de stock com motivo registado.",
  },
  {
    key: "armazenamento",
    title: "Armazenamento",
    desc: "Persistência transacional no PostgreSQL (pedidos, itens, produtos, histórico de ajustes). Transações ACID garantem consistência.",
  },
  {
    key: "processamento",
    title: "Processamento",
    desc: "No checkout, uma única transação de base de dados baixa stock, cria o pedido e as linhas — tudo ou nada (rollback se falhar).",
  },
  {
    key: "relatorios",
    title: "Documentos / relatórios",
    desc: "Comprovante do pedido, lista \"Meus pedidos\", painel do vendedor e relatório imprimível/CSV para análise.",
  },
] as const;
