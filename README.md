# TechStore SPT

Atividade acadêmica de **Sistema de Processamento de Transações (SPT)**: loja de demonstração com catálogo, carrinho, checkout e painel do vendedor.

O código não contém dados de clientes. Produtos do seed são fictícios (notebook, mouse, teclado, etc.).

## Demo

[site-tpo.vercel.app](https://site-tpo.vercel.app)

## Stack

Next.js · TypeScript · PostgreSQL (Drizzle) · Tailwind CSS

## Como executar

1. Copie `.env.example` para `.env.local` e preencha `DATABASE_URL` (Neon, Supabase ou Postgres local).
2. Defina `VENDEDOR_PIN` se quiser proteger `/vendedor`.
3. Instale e rode:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Acesse `http://localhost:3000`.

## Licença

MIT
