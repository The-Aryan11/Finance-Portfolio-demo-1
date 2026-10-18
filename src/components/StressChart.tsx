import { useEffect, useMemo, useRef, useState } from "react";
import type { Scenario } from "../data/scenarios";
import type { Series } from "../lib/sim";

interface View {
  bench: number[];
  fund: number[];
  lo: number;
  hi: number;
}

function toView(s: Series): View {
  const all = [...s.bench, ...s.fund];
  const lo = Math.max(0, Math.floor((Math.min(...all) - 3) / 10) * 10);
  const hi = Math.ceil((Math.max(...all) + 3) / 10) * 10;
  return { bench: s.bench, fund: s.fund, lo, hi };
}

function useTween(target: View, ms: number): View {
  const [view, setView] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const from = cur.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = ms <= 0 ? 1 : Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      const mix = (a: number, b: number) => a + (b - a) * e;
      const v: View = {
        bench: from.bench.map((a, i) => mix(a, target.bench[i])),
        fund: from.fund.map((a, i) => mix(a, target.fund[i])),
        lo: mix(from.lo, target.lo),
        hi: mix(from.hi, target.hi),
      };
      cur.current = v;
      setView(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return view;
}

interface Props {
  scenario: Scenario;
  selected: number | null;
  onSelect: (id: number) => void;
  hover: number | null;
  onHover: (i: number | null) => void;
  fast: boolean;
}

export default function StressChart({ scenario, selected, onSelect, hover, onHover, fast }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(900);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const target = useMemo(() => toView(scenario.series), [scenario]);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const view = useTween(target, reduce ? 0 : fast ? 180 : 750);

  const small = w < 560;
  const h = small ? 300 : w < 900 ? 380 : 440;
  const m = { l: small ? 34 : 42, r: small ? 54 : 78, t: 14, b: 30 };
  const iw = Math.max(50, w - m.l - m.r);
  const ih = h - m.t - m.b;
  const n = view.fund.length;
  const x = (i: number) => m.l + (i / (n - 1)) * iw;
  const y = (v: number) => m.t + ((view.hi - v) / (view.hi - view.lo)) * ih;

  const path = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const area =
    view.bench.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("") +
    view.fund
      .map((v, i) => `L${x(n - 1 - i).toFixed(1)},${y(view.fund[n - 1 - i]).toFixed(1)}`)
      .join("") +
    "Z";

  const range = view.hi - view.lo;
  const step = range > 120 ? 20 : range > 60 ? 10 : 5;
  const ticks: number[] = [];
  for (let v = Math.ceil(view.lo / step) * step; v <= view.hi + 0.01; v += step) ticks.push(v);

  const xTicks = [0, 0.25, 0.5, 0.75, 1];

  let by = y(view.bench[n - 1]);
  let fy = y(view.fund[n - 1]);
  if (Math.abs(by - fy) < 15) {
    const mid = (by + fy) / 2;
    if (fy < by) {
      fy = mid - 8;
      by = mid + 8;
    } else {
      fy = mid + 8;
      by = mid - 8;
    }
  }

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    onHover(Math.max(0, Math.min(n - 1, Math.round((px / r.width) * (n - 1)))));
  };

  return (
    <div ref={wrap} className="w-full">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`Equity curves for the fund and the benchmark during ${scenario.label}`}
        className="block select-none"
      >
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-accent)" strokeWidth="0.9" opacity="0.4" />
          </pattern>
        </defs>

        {ticks.map((v) => (
          <g key={v}>
            <line
              x1={m.l}
              x2={m.l + iw}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--color-rule)"
              strokeWidth={v === 100 ? 1 : 0.6}
              strokeDasharray={v === 100 ? "4 3" : undefined}
            />
            <text x={m.l - 8} y={y(v) + 3.5} textAnchor="end" className="num" fontSize="10.5" fill="var(--color-muted)">
              {Math.round(v)}
            </text>
          </g>
        ))}
        {xTicks.map((t, k) => (
          <text
            key={t}
            x={m.l + t * iw}
            y={h - 8}
            textAnchor={k === 0 ? "start" : k === xTicks.length - 1 ? "end" : "middle"}
            className="num"
            fontSize="10.5"
            fill="var(--color-muted)"
          >
            {scenario.labelAt(t)}
          </text>
        ))}
        <line x1={m.l} x2={m.l + iw} y1={m.t + ih} y2={m.t + ih} stroke="var(--color-ink)" strokeWidth="1" />

        <path d={area} fill="url(#hatch)" />
        <path d={path(view.bench)} fill="none" stroke="var(--color-muted)" strokeWidth="1.6" strokeLinejoin="round" />
        <path d={path(view.fund)} fill="none" stroke="var(--color-accent)" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />

        <text x={m.l + iw + 8} y={by + 3.5} className="num" fontSize="10.5" fill="var(--color-muted)">
          Bench {view.bench[n - 1].toFixed(0)}
        </text>
        <text x={m.l + iw + 8} y={fy + 3.5} className="num" fontSize="10.5" fontWeight="500" fill="var(--color-accent)">
          Fund {view.fund[n - 1].toFixed(0)}
        </text>

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={m.t + ih} stroke="var(--color-ink)" strokeWidth="0.8" />
            <circle cx={x(hover)} cy={y(view.bench[hover])} r="3.5" fill="var(--color-paper)" stroke="var(--color-muted)" strokeWidth="1.5" />
            <circle cx={x(hover)} cy={y(view.fund[hover])} r="4" fill="var(--color-accent)" />
          </g>
        )}

        <rect
          x={m.l}
          y={m.t}
          width={iw}
          height={ih}
          fill="transparent"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => onHover(null)}
          style={{ touchAction: "pan-y", cursor: "crosshair" }}
        />

        {scenario.trades.map((t) => {
          const i = Math.round(t.t * (n - 1));
          const cx = x(i);
          const cy = y(view.fund[i]);
          const on = selected === t.id;
          return (
            <g
              key={t.id}
              className="marker"
              role="button"
              tabIndex={0}
              aria-label={`Read my mind: trade ${t.id}, ${t.side} ${t.name}`}
              onClick={() => onSelect(t.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(t.id);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={cx} cy={cy} r="20" fill="transparent" />
              {on && <line x1={cx} x2={cx} y1={cy} y2={m.t + ih} stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2 3" />}
              <circle
                className="ring"
                cx={cx}
                cy={cy}
                r="11"
                fill={on ? "var(--color-accent)" : "var(--color-paper)"}
                stroke="var(--color-accent)"
                strokeWidth="1.6"
              />
              <text
                x={cx}
                y={cy + 3.6}
                textAnchor="middle"
                className="num"
                fontSize="11"
                fontWeight="500"
                fill={on ? "var(--color-paper)" : "var(--color-accent)"}
                pointerEvents="none"
              >
                {t.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
