import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Scenario, Trade } from "../data/scenarios";
import { fmtBps } from "../lib/sim";

interface Props {
  trade: Trade;
  scenario: Scenario;
  total: number;
  onClose: () => void;
  onStep: (dir: -1 | 1) => void;
}

export default function MindPanel({ trade, scenario, total, onClose, onStep }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    opener.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      if (opener.current instanceof HTMLElement) opener.current.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  const t = trade;
  const gain = t.pnlBps >= 0;
  const limitPct = Math.min(100, (t.sizePct / 6) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end md:items-stretch" role="presentation">
      <button
        aria-label="Close note"
        className="absolute inset-0 bg-(--color-ink)/25 cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Read my mind: ${t.name}`}
        data-lenis-prevent
        key={`${scenario.id}-${t.id}`}
        className="note-card relative flex max-h-[88vh] w-full flex-col overflow-y-auto border-t border-l border-(--color-ink) bg-(--color-paper) md:max-h-none md:w-[460px] md:border-t-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, oklch(0.85 0.03 80 / 0.55) 31px, oklch(0.85 0.03 80 / 0.55) 32px)",
        }}
      >
        <div className="absolute left-5 top-0 bottom-0 w-px bg-(--color-accent)/35 md:left-7" aria-hidden />
        <header className="flex items-start justify-between gap-4 border-b border-(--color-ink) bg-(--color-paper) px-5 py-4 pl-9 md:pl-12">
          <div>
            <p className="label text-(--color-accent)!">Read my mind</p>
            <p className="num mt-1 text-xs text-(--color-muted)">
              Note {String(t.id).padStart(2, "0")} of {String(total).padStart(2, "0")} · {scenario.label}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 grid h-11 w-11 place-items-center rounded-full border border-transparent text-(--color-ink) transition hover:border-(--color-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-6 px-5 py-6 pl-9 md:pl-12">
          <div>
            <p className="num inline-block border border-(--color-accent) px-2 py-0.5 text-[0.7rem] uppercase tracking-wider text-(--color-accent)">
              {t.side}
            </p>
            <h3 className="font-display mt-3 text-3xl leading-tight font-medium">{t.name}</h3>
            <p className="num mt-1 text-sm text-(--color-muted)">
              {t.ticker} · {scenario.labelAt(t.t, true)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 border-y border-(--color-rule) bg-(--color-paper)/80 py-3">
            <div>
              <dt className="label">Position size</dt>
              <dd className="num mt-1 text-2xl">{t.sizePct}% <span className="text-sm text-(--color-muted)">of NAV</span></dd>
            </div>
            <div>
              <dt className="label">Result</dt>
              <dd className="num mt-1 text-2xl">
                {fmtBps(t.pnlBps)} <span className="text-sm text-(--color-muted)">bps</span>
              </dd>
            </div>
            <div className="col-span-2 mt-3">
              <div className="relative h-2 border border-(--color-ink)">
                <div className="h-full bg-(--color-accent)" style={{ width: `${limitPct}%` }} />
              </div>
              <p className="num mt-1 flex justify-between text-[0.68rem] text-(--color-muted)">
                <span>0%</span>
                <span>{t.sizePct > 6 ? "above my 6% single-name limit" : "my 6% single-name limit"}</span>
              </p>
            </div>
          </dl>

          <section>
            <h4 className="label mb-2">What I thought</h4>
            <blockquote className="border-l-2 border-(--color-accent) pl-4 font-body text-[1.05rem] italic leading-relaxed">
              {t.thesis}
            </blockquote>
          </section>

          <section>
            <h4 className="label mb-2">What I'd do differently</h4>
            <p className="bg-(--color-paper)/85 text-[1.05rem] leading-relaxed">{t.different}</p>
          </section>

          <p className="num text-[0.7rem] text-(--color-muted)">
            {gain ? "Counted as a gain" : "Counted as a loss"} on this scenario. Illustrative figures.
          </p>
        </div>

        <footer className="sticky bottom-0 mt-auto flex items-center justify-between border-t border-(--color-ink) bg-(--color-paper) px-5 py-3 pl-9 md:pl-12">
          <button
            onClick={() => onStep(-1)}
            className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm transition hover:bg-(--color-canvas) focus-visible:outline-2 focus-visible:outline-(--color-accent)"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <button
            onClick={() => onStep(1)}
            className="flex min-h-11 items-center gap-2 px-3 py-2 text-sm transition hover:bg-(--color-canvas) focus-visible:outline-2 focus-visible:outline-(--color-accent)"
          >
            Next <ArrowRight size={16} />
          </button>
        </footer>
      </aside>
    </div>
  );
}
