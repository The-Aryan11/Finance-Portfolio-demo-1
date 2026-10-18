import { RECORD } from "../data/ledger";

const cum = (k: "bench" | "fund") => RECORD.reduce((a, r) => a * (1 + r[k] / 100), 1);
const ann = (k: "bench" | "fund") => (Math.pow(cum(k), 1 / RECORD.length) - 1) * 100;
const fmt = (v: number) => (v < 0 ? `(${Math.abs(v).toFixed(1)})` : v.toFixed(1));
const max = Math.max(...RECORD.flatMap((r) => [Math.abs(r.bench), Math.abs(r.fund)]));
const wins = RECORD.filter((r) => r.fund > r.bench);

export default function Record() {
  return (
    <section id="record" className="mx-auto max-w-[1240px] px-5 pb-20 sm:px-8">
      <div className="mb-10 grid gap-6 md:grid-cols-12" data-reveal>
        <div className="md:col-span-7">
          <p className="label mb-4">03 &middot; The record, year by year</p>
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            I beat the market in {wins.length} of {RECORD.length} years.
          </h2>
        </div>
        <p className="text-[1.05rem] leading-relaxed md:col-span-5 md:pt-8">
          Both were years it fell ({wins.map((w) => w.year).join(" and ")}). In every year it rose, I lagged, by design. The job I took is losing
          less in the bad years and staying in the game for the good ones.
        </p>
      </div>

      <div className="overflow-x-auto border border-(--color-ink) bg-(--color-paper)/70" data-reveal>
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr className="border-b border-(--color-ink)">
              <th className="label px-5 py-3 text-left font-normal">Year</th>
              <th className="label px-3 py-3 text-right font-normal">Benchmark %</th>
              <th className="label px-3 py-3 text-right font-normal">Fund %</th>
              <th className="label px-3 py-3 text-right font-normal">Difference</th>
              <th className="label hidden px-5 py-3 text-left font-normal md:table-cell">Fund vs. benchmark</th>
            </tr>
          </thead>
          <tbody>
            {RECORD.map((r) => {
              const d = r.fund - r.bench;
              return (
                <tr key={r.year} className="border-b border-(--color-rule)">
                  <th scope="row" className="num px-5 py-2.5 text-left font-normal">{r.year}</th>
                  <td className="num px-3 py-2.5 text-right text-(--color-muted)">{fmt(r.bench)}</td>
                  <td className="num px-3 py-2.5 text-right">{fmt(r.fund)}</td>
                  <td className={`num px-3 py-2.5 text-right ${d > 0 ? "font-medium text-(--color-accent)" : ""}`}>{d > 0 ? "+" : ""}{fmt(d)}</td>
                  <td className="hidden w-[34%] px-5 py-2.5 md:table-cell">
                    <div className="space-y-1" aria-hidden>
                      <div className="h-1.5 bg-(--color-muted)/60" style={{ width: `${(Math.abs(r.bench) / max) * 100}%` }} />
                      <div className="h-1.5 bg-(--color-accent)" style={{ width: `${(Math.abs(r.fund) / max) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-(--color-ink)">
              <th scope="row" className="font-display px-5 py-4 text-left text-base font-normal">Annualised, {RECORD[0].year}&ndash;{RECORD[RECORD.length - 1].year}</th>
              <td className="num px-3 py-4 text-right text-(--color-muted)">{ann("bench").toFixed(1)}</td>
              <td className="num px-3 py-4 text-right">{ann("fund").toFixed(1)}</td>
              <td className="num dbl-under px-3 py-4 text-right">({Math.abs(ann("fund") - ann("bench")).toFixed(1)})</td>
              <td className="hidden px-5 py-4 text-sm text-(--color-muted) md:table-cell">The cost of sleeping at night.</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="num mt-3 text-xs text-(--color-muted)">Illustrative figures, net of fees. Benchmark: broad US large-cap total return, approximate.</p>
    </section>
  );
}
