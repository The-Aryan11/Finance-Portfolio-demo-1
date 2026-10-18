import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ASSETS, LOSSES } from "../data/ledger";

const totalAssets = ASSETS.reduce((s, a) => s + a.bps, 0);
const totalLiab = LOSSES.reduce((s, l) => s + l.bps, 0);
const fmt = (n: number) => n.toLocaleString("en-US");
const maxLoss = Math.max(...LOSSES.map((l) => l.bps));

export default function BalanceSheet() {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <section id="balance-sheet" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8">
      <div className="mb-10 grid gap-6 md:grid-cols-12" data-reveal>
        <div className="md:col-span-7">
          <p className="label mb-4">02 &middot; Balance sheet, since 2009</p>
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            What I&rsquo;ve got right, and what I owe.
          </h2>
        </div>
        <p className="text-[1.05rem] leading-relaxed md:col-span-5 md:pt-8">
          Most people in my line of work show you only the left-hand side. Assets are my wins and skills. Liabilities are my five
          biggest losses, and each one is still on the books until I&rsquo;ve learned what it cost. Figures are basis points of fund NAV.
        </p>
      </div>

      <div className="grid border border-(--color-ink) bg-(--color-paper)/70 lg:grid-cols-2">
        <div className="border-b border-(--color-ink) lg:border-b-0 lg:border-r">
          <div className="border-b border-(--color-ink) px-5 py-4 sm:px-7">
            <p className="label text-(--color-accent)!">Assets</p>
            <h3 className="font-display text-2xl">Wins &amp; skills</h3>
          </div>
          <ul>
            {ASSETS.map((a, i) => (
              <li key={a.title} className="grid grid-cols-[1fr_auto] gap-4 border-b border-(--color-rule) px-5 py-5 sm:px-7" data-reveal>
                <div>
                  <p className="num text-xs text-(--color-muted)">A.{i + 1}</p>
                  <h4 className="font-display text-xl leading-snug">{a.title}</h4>
                  <p className="mt-1 text-[1rem] leading-relaxed text-(--color-muted)">{a.note}</p>
                </div>
                <p className="num pt-5 text-lg text-(--color-accent)" data-count={a.bps}>{fmt(a.bps)}</p>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between px-5 py-5 sm:px-7">
            <p className="font-display text-lg">Total assets</p>
            <p className="num dbl-under text-xl">{fmt(totalAssets)}</p>
          </div>
        </div>

        <div>
          <div className="border-b border-(--color-ink) px-5 py-4 sm:px-7">
            <p className="label">Liabilities</p>
            <h3 className="font-display text-2xl">My five biggest losses</h3>
          </div>
          <ul>
            {LOSSES.map((l) => {
              const on = open === l.no;
              return (
                <li key={l.no} className="border-b border-(--color-rule)" data-reveal>
                  <button
                    onClick={() => setOpen(on ? null : l.no)}
                    aria-expanded={on}
                    aria-controls={`loss-${l.no}`}
                    className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 px-5 py-5 text-left transition hover:bg-(--color-canvas) focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--color-accent) sm:gap-x-4 sm:px-7"
                  >
                    <span className="num text-xs text-(--color-muted)">L.{l.no}</span>
                    <span>
                      <span className="num block text-xs text-(--color-muted)">{l.year}</span>
                      <span className="font-display block text-xl leading-snug">{l.title}</span>
                    </span>
                    <span className="num text-lg">({fmt(l.bps)})</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${on ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  <div className="px-5 sm:px-7">
                    <div className="h-[3px] bg-(--color-rule)/60" aria-hidden>
                      <div className="loss-bar h-full bg-(--color-ink)" style={{ width: `${(l.bps / maxLoss) * 100}%` }} />
                    </div>
                  </div>
                  <div
                    id={`loss-${l.no}`}
                    className="grid transition-[grid-template-rows] duration-400 ease-out"
                    style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-4 px-5 pb-6 pt-4 sm:px-7">
                        <p className="num text-xs text-(--color-muted)">{l.meta}</p>
                        <div>
                          <h5 className="label mb-1">What I thought</h5>
                          <p className="leading-relaxed">{l.thought}</p>
                        </div>
                        <div>
                          <h5 className="label mb-1">What happened</h5>
                          <p className="leading-relaxed">{l.happened}</p>
                        </div>
                        <div className="border-l-2 border-(--color-accent) pl-4">
                          <h5 className="label mb-1 text-(--color-accent)!">What it taught me</h5>
                          <p className="font-medium leading-relaxed">{l.taught}</p>
                          <p className="mt-2 text-sm text-(--color-muted)"><span className="num">Rule on file:</span> {l.rule}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex items-baseline justify-between px-5 py-5 sm:px-7">
            <p className="font-display text-lg">Total liabilities</p>
            <p className="num dbl-under text-xl">({fmt(totalLiab)})</p>
          </div>
        </div>
      </div>

      <div className="mt-0 grid items-baseline gap-2 border border-t-0 border-(--color-ink) bg-(--color-accent) px-5 py-6 text-(--color-paper) sm:grid-cols-[1fr_auto] sm:px-7" data-reveal>
        <div>
          <p className="label text-(--color-paper)/80!">Net position</p>
          <p className="font-display text-2xl leading-snug sm:text-3xl">What&rsquo;s left after paying for my mistakes.</p>
        </div>
        <p className="num text-4xl sm:text-5xl">+{fmt(totalAssets - totalLiab)} <span className="text-lg">bps</span></p>
      </div>
    </section>
  );
}
