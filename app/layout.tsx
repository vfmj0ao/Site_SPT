import type { Metadata } from "next";

import { Header } from "@/components/Header";
import { CartProvider } from "@/lib/cart-context";

import "./globals.css";

export const metadata: Metadata = {
  title: "TechStore TPO — Loja + SPT",
  description:
    "Demonstração de loja online com SPT (Sistema de Processamento de Transações) em PostgreSQL — modo cliente e vendedor.",
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
          <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
            TechStore TPO — SPT (Sistema de Processamento de Transações) com PostgreSQL
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
