import { useCallback, useMemo, useState } from "react";
import StressChart from "../components/StressChart";
import ScenarioSlider from "../components/ScenarioSlider";
import MindPanel from "../components/MindPanel";
import { DEFAULT_CUSTOM, HISTORIC, buildCustom, type CustomParams, type ScenarioId } from "../data/scenarios";
import { fmtBps, fmtPct, summarize } from "../lib/sim";

function Row({ label, bench, fund, strong }: { label: string; bench: string; fund: string; strong?: boolean }) {
  return (
    <tr className="border-b border-(--color-rule)">
      <th scope="row" className="py-2.5 pr-2 text-left text-[0.95rem] font-normal">{label}</th>
      <td className="num py-2.5 text-right text-[0.95rem] text-(--color-muted)">{bench}</td>
      <td className={`num py-2.5 pl-3 text-right text-[0.95rem] ${strong ? "font-medium text-(--color-accent)" : ""}`}>{fund}</td>
    </tr>
  );
}

function Control({ label, value, unit, min, max, step, onChange }: {
  label: string; value: number; unit: string; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="label">{label}</span>
        <span className="num text-lg">{value}{unit}</span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ruler"
        aria-label={label}
      />
    </label>
  );
}

export default function StressLab() {
  const [id, setId] = useState<ScenarioId>("2008");
  const [custom, setCustom] = useState<CustomParams>(DEFAULT_CUSTOM);
  const [selected, setSelected] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const scenario = useMemo(() => (id === "custom" ? buildCustom(custom) : HISTORIC[id]), [id, custom]);
  const sum = useMemo(() => summarize(scenario.series), [scenario]);
  const n = scenario.series.fund.length;
  const idx = hover ?? n - 1;
  const b = scenario.series.bench[idx];
  const f = scenario.series.fund[idx];

  const pick = (next: ScenarioId) => {
    setId(next);
    setSelected(null);
    setHover(null);
  };

  const trade = scenario.trades.find((t) => t.id === selected) ?? null;
  const step = useCallback(
    (dir: -1 | 1) =>
      setSelected((cur) => {
        const len = scenario.trades.length;
        const i = scenario.trades.findIndex((t) => t.id === cur);
        return scenario.trades[(i + dir + len) % len].id;
      }),
    [scenario],
  );
  const close = useCallback(() => setSelected(null), []);

  const lessDD = Math.abs(sum.benchDD) - Math.abs(sum.fundDD);
  const ahead = sum.fundRet - sum.benchRet;
  const verdict = (
    <>
      The benchmark ended at <span className="num">{fmtPct(sum.benchRet)}</span>; the fund at{" "}
      <span className="num">{fmtPct(sum.fundRet)}</span>.{" "}
      {ahead >= 0
        ? `That's ${(ahead * 100).toFixed(1)} points ahead, and at the worst moment I lost ${(lessDD * 100).toFixed(0)} points less.`
        : `That's ${(-ahead * 100).toFixed(1)} points behind. I lost less on the way down (${(lessDD * 100).toFixed(0)} points less at the worst moment) and gave it back on the way up.`}{" "}
      {sum.capture !== null &&
        `From the low, I captured ${Math.max(0, Math.round(sum.capture * 100))}% of the rebound. That is the price of the protection.`}
    </>
  );

  return (
    <section id="stress-test" className="mx-auto max-w-[1240px] px-5 pb-20 sm:px-8">
      <div className="grid gap-8 border-b border-(--color-ink) pb-10 pt-12 md:grid-cols-12 md:gap-12 md:pt-16">
        <div className="md:col-span-8" data-reveal>
          <p className="label mb-5">Exhibit A &middot; Fund III &middot; long/short equity</p>
          <h1 className="font-display text-[2.6rem] leading-[1.02] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            I won&rsquo;t say I beat the market.
            <span className="block italic text-(--color-accent)">Pick a crash and watch.</span>
          </h1>
        </div>
        <div className="md:col-span-4 md:pt-10" data-reveal>
          <p className="text-[1.05rem] leading-relaxed">
            I&rsquo;m Maya Iyer. I run a long/short equity fund, and most years it lags a rising market on purpose.
            Choose a market event below. The lines redraw, my fund against the benchmark, and every numbered mark on my line is a trade
            you can open and read.
          </p>
        </div>
      </div>

      <div className="border-b border-(--color-ink) border-x bg-(--color-paper)/70" data-reveal>
        <div className="flex items-center justify-between border-b border-(--color-rule) px-4 py-3 sm:px-8">
          <p className="label">Scenario &middot; slide, or tap a year</p>
          <p className="num text-xs text-(--color-muted)">Index, start = 100</p>
        </div>
        <div className="pt-8">
          <ScenarioSlider value={id} onChange={pick} />
        </div>

        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: id === "custom" ? "1fr" : "0fr" }}
          aria-hidden={id !== "custom"}
        >
          <div className="overflow-hidden">
            <div className="mx-4 mb-4 grid gap-6 border border-dashed border-(--color-ink)/50 p-5 sm:mx-8 md:grid-cols-3">
              <Control label="Market falls" value={custom.drop} unit="%" min={10} max={60} step={1} onChange={(v) => setCustom({ ...custom, drop: v })} />
              <Control label="Over" value={custom.fallMonths} unit=" mo" min={1} max={18} step={1} onChange={(v) => setCustom({ ...custom, fallMonths: v })} />
              <Control label="Then recovers" value={custom.rebound} unit="% of loss" min={0} max={100} step={5} onChange={(v) => setCustom({ ...custom, rebound: v })} />
            </div>
          </div>
        </div>

        <div className="grid border-t border-(--color-rule) lg:grid-cols-12">
          <div className="min-w-0 p-3 sm:p-6 lg:col-span-8 lg:border-r lg:border-(--color-rule)">
            <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:px-2">
              <div>
                <p className="label">{hover === null ? "At the end" : "On"}</p>
                <p className="num text-sm sm:text-base">{scenario.labelAt(idx / (n - 1), true)}</p>
              </div>
              <div>
                <p className="label flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-(--color-muted)" />Benchmark</p>
                <p className="num text-sm sm:text-base">{b.toFixed(1)}</p>
              </div>
              <div>
                <p className="label flex items-center gap-1.5"><span className="inline-block h-[3px] w-4 bg-(--color-accent)" />My fund</p>
                <p className="num text-sm text-(--color-accent) sm:text-base">{f.toFixed(1)}</p>
              </div>
              <div>
                <p className="label">Gap</p>
                <p className="num text-sm sm:text-base">{f - b >= 0 ? "+" : "("}{Math.abs(f - b).toFixed(1)}{f - b < 0 ? ")" : ""} pts</p>
              </div>
            </div>
            <StressChart
              scenario={scenario}
              selected={selected}
              onSelect={setSelected}
              hover={hover}
              onHover={setHover}
              fast={id === "custom"}
            />
            <p className="mt-2 px-1 text-sm text-(--color-muted)">
              <span className="inline-block h-2 w-4 align-middle" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--color-accent) 0 1px, transparent 1px 4px)" }} />{" "}
              The hatched area is the gap between the two lines. Hover to read a day. Open any numbered trade to read my mind.
            </p>
          </div>

          <aside className="p-5 sm:p-6 lg:col-span-4">
            <p className="label mb-1">Statement of results</p>
            <p className="mb-3 text-sm text-(--color-muted)">{scenario.sub}. {scenario.blurb}</p>
            <table className="w-full border-t border-(--color-ink)">
              <thead>
                <tr>
                  <th className="sr-only">Measure</th>
                  <th className="label py-2 text-right font-normal">Bench</th>
                  <th className="label py-2 pl-3 text-right font-normal">Fund</th>
                </tr>
              </thead>
              <tbody>
                <Row label="Total return" bench={fmtPct(sum.benchRet)} fund={fmtPct(sum.fundRet)} strong />
                <Row label="Worst drawdown" bench={fmtPct(sum.benchDD)} fund={fmtPct(sum.fundDD)} />
                <Row
                  label="Captured from the low"
                  bench="100%"
                  fund={sum.capture === null ? "n/a" : `${Math.max(0, Math.round(sum.capture * 100))}%`}
                />
              </tbody>
            </table>
            <p className="mt-5 border-t-[3px] border-double border-(--color-ink) pt-4 text-[1.02rem] leading-relaxed">{verdict}</p>
          </aside>
        </div>

        <div className="border-t border-(--color-ink) px-4 py-4 sm:px-8">
          <p className="label mb-3">Trade tape &middot; open one to read my mind</p>
          <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
            {scenario.trades.map((t) => (
              <li key={t.id} className="border-b border-(--color-rule) sm:border-b-0">
                <button
                  onClick={() => setSelected(t.id)}
                  className="group flex min-h-14 w-full items-start gap-3 px-1 py-3 text-left transition hover:bg-(--color-canvas) focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--color-accent)"
                >
                  <span className="num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-(--color-accent) text-xs text-(--color-accent) transition group-hover:bg-(--color-accent) group-hover:text-(--color-paper)">
                    {t.id}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.95rem] leading-snug">{t.side} &middot; {t.name}</span>
                    <span className="num block text-xs text-(--color-muted)">{fmtBps(t.pnlBps)} bps &middot; {t.sizePct}% NAV</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="num mt-4 text-xs text-(--color-muted)">
        Illustrative only. Benchmark paths are approximated from public index levels; fund paths are simulated. Fictional manager, fictional securities.
      </p>

      {trade && <MindPanel trade={trade} scenario={scenario} total={scenario.trades.length} onClose={close} onStep={step} />}
    </section>
  );
}
