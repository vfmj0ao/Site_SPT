/** Textos fixos sobre o SPT (Sistema de Processamento de Transações) — uso académico. */
export const SPT_FULL_NAME = "Sistema de Processamento de Transações";
export const SPT_ACRONYM = "SPT";

/** Em inglês, nome usual da mesma classe de sistemas (por extenso, para não confundir com SPT). */
export const SPT_PARALLEL_ENGLISH_NAME = "Transaction Processing System";

/** Definição curta para quem abre o site pela primeira vez. */
export const SPT_WHAT_IS = `${SPT_ACRONYM} (${SPT_FULL_NAME}) designa, neste trabalho, um sistema em que cada operação de negócio relevante é tratada como uma transação curta na base de dados: regras aplicadas no servidor, estado consistente e resultado rastreável — típico de um ${SPT_PARALLEL_ENGLISH_NAME} (TPS), em contraste com processamento pesado em lote.`;

/** Porque uma única transação no checkout importa para a demonstração. */
export const SPT_WHY_SINGLE_TRANSACTION =
  "Se validação de stock, criação do pedido e inserção das linhas fossem passos independentes sem transação, uma falha a meio poderia deixar stock baixado sem pedido, ou pedido sem linhas. O Drizzle/PostgreSQL agrupa tudo em getDb().transaction: ou conclui tudo (COMMIT) ou desfaz efeitos parciais (ROLLBACK).";

export const sptPhases = [
  {
    key: "coleta",
    title: "Coleta",
    desc: "Entrada de dados: escolha de produtos, quantidades no carrinho e dados do cliente no checkout. Tudo é revalidado no servidor.",
    links: [
      { href: "/", label: "Catálogo" },
      { href: "/cart", label: "Carrinho" },
      { href: "/checkout", label: "Checkout" },
    ],
  },
  {
    key: "edicao",
    title: "Edição / manipulação / correção",
    desc: "Regras e ajustes antes e durante a gravação: validação (Zod), conferência de estoque e, no painel do vendedor, correção de stock com motivo registado.",
    links: [
      { href: "/checkout", label: "Validação no checkout" },
      { href: "/vendedor/produtos", label: "Produtos e stock" },
    ],
  },
  {
    key: "armazenamento",
    title: "Armazenamento",
    desc: "Persistência transacional no PostgreSQL (pedidos, itens, produtos, histórico de ajustes). Transações ACID garantem consistência.",
    links: [{ href: "/como-funciona", label: "Mapa técnico" }],
  },
  {
    key: "processamento",
    title: "Processamento",
    desc: "No checkout, uma única transação de base de dados baixa stock, cria o pedido e as linhas — tudo ou nada (rollback se falhar).",
    links: [{ href: "/checkout", label: "Onde confirmas o pedido" }],
  },
  {
    key: "relatorios",
    title: "Documentos / relatórios",
    desc: "Comprovante do pedido, lista \"Meus pedidos\", painel do vendedor e relatório imprimível/CSV para análise.",
    links: [
      { href: "/pedidos", label: "Meus pedidos" },
      { href: "/vendedor", label: "Painel" },
      { href: "/vendedor/relatorio", label: "Relatório" },
    ],
  },
] as const;

/** Letras ACID explicadas em linguagem de demonstração (não substituem a literatura). */
export const sptAcidExplained = [
  {
    letter: "A",
    name: "Atomicidade",
    text: "O pedido de checkout não fica “meio gravado”: ou todas as escritas dentro da transação vão para a base, ou nenhuma.",
  },
  {
    letter: "C",
    name: "Consistência",
    text: "Regras como “stock não pode ficar negativo” são aplicadas com UPDATE … WHERE stock >= quantidade; se não houver linhas atualizadas, a transação aborta.",
  },
  {
    letter: "I",
    name: "Isolamento",
    text: "Pedidos concorrentes não devem ver stock intermédio uns dos outros de forma inconsistente; o motor relacional serializa/isola conforme o nível de isolamento.",
  },
  {
    letter: "D",
    name: "Durabilidade",
    text: "Após COMMIT, o pedido e as linhas permanecem gravados — daí o comprovante e as listagens refletirem o estado persistido.",
  },
] as const;

/** Passos alinhados ao fluxo em app/actions/orders.ts (placeOrder). */
export const sptCheckoutDbSteps = [
  "Validação do payload no servidor com Zod (rejeita dados inválidos antes de tocar na base).",
  "Início da transação na ligação PostgreSQL (BEGIN implícito no .transaction).",
  "Para cada produto: UPDATE de stock só se stock >= quantidade pedida; em falha, lança erro e a transação faz rollback.",
  "INSERT do cabeçalho do pedido (cliente, total).",
  "INSERT das linhas do pedido (produto, quantidade, preço unitário capturado no momento).",
  "COMMIT se tudo correu bem; em qualquer erro, ROLLBACK e o utilizador vê mensagem genérica.",
] as const;

export const sptTpsVsLote = `Um ${SPT_PARALLEL_ENGLISH_NAME} (TPS) trata muitas transações curtas e interactivas (como um checkout). Processamento em lote agrega trabalho fora da hora de pico (ficheiros, fechos contabilísticos). Este site ilustra o primeiro caso.`;

/** Onde ler o comportamento no código (caminhos relativos ao repositório). */
export const sptCodePointers = [
  {
    path: "app/actions/orders.ts",
    note: "placeOrder: transação com update de stock, insert de pedido e de linhas.",
  },
  {
    path: "app/actions/seller.ts",
    note: "Ajustes de stock e relatórios dentro de transações e consultas ao schema.",
  },
  {
    path: "db/schema.ts",
    note: "Modelo relacional: produtos, pedidos, itens, stock_adjustments.",
  },
] as const;
