import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Página não encontrada
      </h1>
      <Link href="/" className="text-emerald-700 underline dark:text-emerald-400">
        Voltar ao início
      </Link>
    </div>
  );
}
