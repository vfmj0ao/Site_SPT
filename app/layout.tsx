import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/Header";
import { CartProvider } from "@/lib/cart-context";

import "./globals.css";

export const metadata: Metadata = {
  title: "TechStore SPT — Loja (Sistema de Processamento de Transações)",
  description:
    "Demonstração académica de SPT (Sistema de Processamento de Transações) em PostgreSQL: checkout transacional ACID, painel do vendedor e relatórios.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <footer className="border-t border-zinc-200 py-6 text-center text-xs leading-relaxed text-zinc-500 dark:border-zinc-800">
            <p>
              TechStore SPT — demonstração académica de{" "}
              <abbr title="Sistema de Processamento de Transações" className="cursor-help no-underline">
                SPT
              </abbr>{" "}
              em PostgreSQL.
            </p>
            <p className="mt-1">
              <Link href="/como-funciona" className="text-indigo-600 underline dark:text-indigo-400">
                Como funciona o SPT neste site
              </Link>
            </p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
