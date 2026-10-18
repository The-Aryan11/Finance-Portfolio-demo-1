export const POINTS = 160;

export type Anchor = [number, number];

export interface FundParams {
  base: number;
  cut: number;
  alpha: number;
  idio: number;
}

export interface Series {
  bench: number[];
  fund: number[];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rnd: () => number) {
  const u = Math.max(rnd(), 1e-9);
  const v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function interpLog(anchors: Anchor[], t: number) {
  for (let k = 1; k < anchors.length; k++) {
    const [t0, v0] = anchors[k - 1];
    const [t1, v1] = anchors[k];
    if (t <= t1) {
      const f = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
      return Math.log(v0) + f * (Math.log(v1) - Math.log(v0));
    }
  }
  return Math.log(anchors[anchors.length - 1][1]);
}

export function simulate(anchors: Anchor[], vol: number, fp: FundParams, seed: number): Series {
  const rnd = mulberry32(seed);
  const n = POINTS;
  const walk = [0];
  for (let i = 1; i < n; i++) walk.push(walk[i - 1] + gauss(rnd) * vol);

  const idx = anchors.map(([t]) => Math.round(t * (n - 1)));
  const bench: number[] = [];
  for (let i = 0; i < n; i++) {
    let seg = 1;
    while (seg < idx.length - 1 && i > idx[seg]) seg++;
    const i0 = idx[seg - 1];
    const i1 = idx[seg];
    const f = i1 === i0 ? 0 : (i - i0) / (i1 - i0);
    const bridge = walk[i] - walk[i0] - f * (walk[i1] - walk[i0]);
    bench.push(Math.exp(interpLog(anchors, i / (n - 1)) + bridge));
  }

  const fund = [100];
  let peak = bench[0];
  let e = fp.base;
  for (let i = 1; i < n; i++) {
    peak = Math.max(peak, bench[i - 1]);
    const dd = 1 - bench[i - 1] / peak;
    const target = fp.base * (1 - fp.cut * Math.min(1, dd / 0.3));
    e += (target - e) * 0.07;
    const r = bench[i] / bench[i - 1] - 1;
    const fr = e * r + fp.alpha + fp.idio * gauss(rnd);
    fund.push(fund[i - 1] * (1 + fr));
  }
  return { bench, fund };
}

export function maxDrawdown(s: number[]) {
  let peak = s[0];
  let worst = 0;
  for (const v of s) {
    peak = Math.max(peak, v);
    worst = Math.min(worst, v / peak - 1);
  }
  return worst;
}

export function summarize(s: Series) {
  const last = s.bench.length - 1;
  const benchRet = s.bench[last] / s.bench[0] - 1;
  const fundRet = s.fund[last] / s.fund[0] - 1;
  let troughI = 0;
  s.bench.forEach((v, i) => {
    if (v < s.bench[troughI]) troughI = i;
  });
  const benchBounce = s.bench[last] / s.bench[troughI] - 1;
  const fundBounce = s.fund[last] / s.fund[troughI] - 1;
  const capture = troughI < last - 3 && benchBounce > 0.02 ? fundBounce / benchBounce : null;
  return {
    benchRet,
    fundRet,
    benchDD: maxDrawdown(s.bench),
    fundDD: maxDrawdown(s.fund),
    capture,
    troughI,
  };
}

export function fmtPct(x: number, digits = 1) {
  const v = Math.abs(x * 100).toFixed(digits);
  return x < 0 ? `(${v}%)` : `${x > 0 ? "+" : ""}${v}%`;
}

export function fmtBps(x: number) {
  const v = Math.abs(Math.round(x)).toLocaleString("en-US");
  return x < 0 ? `(${v})` : `+${v}`;
}

export function businessDate(start: Date, t: number, days: number) {
  const d = new Date(start);
  let remaining = Math.round(t * days);
  while (remaining > 0) {
    d.setDate(d.getDate() + 1);
    const w = d.getDay();
    if (w !== 0 && w !== 6) remaining--;
  }
  return d;
}
