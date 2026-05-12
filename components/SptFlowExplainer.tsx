import { SPT_ACRONYM, SPT_FULL_NAME, sptPhases } from "@/lib/spt-copy";

export function SptFlowExplainer() {
  return (
    <section
      aria-labelledby="spt-fluxo-heading"
      className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/30"
    >
      <h2
        id="spt-fluxo-heading"
        className="text-lg font-semibold text-indigo-950 dark:text-indigo-100"
      >
        Fluxo completo do {SPT_ACRONYM} ({SPT_FULL_NAME})
      </h2>
      <p className="mt-2 text-sm text-indigo-900/90 dark:text-indigo-200/90">
        Em inglês costuma usar-se o acrónimo <strong>TPS</strong> (Transaction Processing
        System); em português o equivalente é <strong>{SPT_ACRONYM}</strong> — o mesmo tipo
        de sistema (transações curtas, consistentes e rastreáveis).
      </p>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {sptPhases.map((p, i) => (
          <li
            key={p.key}
            className="relative rounded-xl border border-indigo-200/80 bg-white/90 p-3 text-sm shadow-sm dark:border-indigo-800/80 dark:bg-zinc-950/60"
          >
            <span className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <p className="pl-5 font-semibold text-indigo-950 dark:text-indigo-100">
              {p.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {p.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
