import { businessDate, simulate, type Anchor, type FundParams, type Series } from "../lib/sim";

export type ScenarioId = "2008" | "2020" | "2022" | "custom";

export interface Trade {
  id: number;
  t: number;
  side: string;
  name: string;
  ticker: string;
  sizePct: number;
  pnlBps: number;
  thesis: string;
  different: string;
}

export interface Scenario {
  id: ScenarioId;
  label: string;
  sub: string;
  blurb: string;
  series: Series;
  trades: Trade[];
  labelAt: (t: number, long?: boolean) => string;
}

export interface CustomParams {
  drop: number;
  fallMonths: number;
  rebound: number;
}

export const DEFAULT_CUSTOM: CustomParams = { drop: 35, fallMonths: 5, rebound: 45 };

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dateLabeler(start: Date, days: number) {
  return (t: number, long = false) => {
    const d = businessDate(start, t, days);
    return long
      ? `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`
      : `${MON[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
  };
}

const FUND: FundParams = { base: 0.5, cut: 0.55, alpha: 0.0003, idio: 0.0035 };

const A2008: Anchor[] = [
  [0, 100], [0.1, 86.6], [0.15, 70.4], [0.157, 78.5], [0.21, 66.5], [0.243, 78.7],
  [0.3, 58.9], [0.45, 70.7], [0.535, 63], [0.7, 52.9], [0.865, 66], [1, 73.8],
];
const A2020: Anchor[] = [
  [0, 100], [0.02, 95.3], [0.05, 87.2], [0.07, 92.4], [0.093, 81.1], [0.125, 80],
  [0.13, 70.5], [0.165, 66.1], [0.19, 77.7], [0.29, 84.9], [0.57, 95.4], [0.67, 88.9], [1, 103.4],
];
const A2022: Anchor[] = [
  [0, 100], [0.14, 88.1], [0.18, 86.9], [0.23, 96.5], [0.45, 76.4], [0.62, 89.7],
  [0.8, 74.6], [0.92, 85.1], [1, 80],
];

const T2008: Trade[] = [
  {
    id: 1, t: 0.01, side: "Short", name: "Harlow Regional Bancorp", ticker: "HRLW", sizePct: 4.5, pnlBps: 212,
    thesis: "61% of the loan book is construction and commercial property, and reserves cover 0.8% of it. The dividend is being paid out of capital the bank doesn't really have. Nobody reads the footnotes, so nobody has priced this.",
    different: "I sized it at 4.5%. It should have been 7%. I was right on the thesis and timid on the number, which is a strange kind of mistake to still be a little proud of.",
  },
  {
    id: 2, t: 0.09, side: "Long", name: "Short-dated Treasury bills", ticker: "UST-3M", sizePct: 20, pnlBps: 38,
    thesis: "Park cash where the counterparty is a government. The yield is irrelevant. I wanted to be able to sleep, and I wanted to be able to buy things later.",
    different: "Nothing, really. I'd have done it a week earlier. Safety is cheapest when nobody is asking for it.",
  },
  {
    id: 3, t: 0.16, side: "Cover", name: "Half of the bank short", ticker: "HRLW", sizePct: 2.2, pnlBps: -85,
    thesis: "A one-day +11% relief rally on a rescue headline. I took profit on half the short because it hurt to watch. The thesis hadn't changed; my pain tolerance had.",
    different: "Write the covering rule in advance and make it about price and fundamentals, never about relief. The bounce lasted nine days. I was out of the short for all of them.",
  },
  {
    id: 4, t: 0.3, side: "Long", name: "Aldous Foods", ticker: "ALDF", sizePct: 5, pnlBps: 61,
    thesis: "People still buy oatmeal. Staples held 70% of their earnings through the last two recessions and the stock had been marked down with everything else.",
    different: "It worked, but I treated it as a safe haven. It is a recession-resistant business, not a recession-proof price. I'd size it at 3% and say so out loud.",
  },
  {
    id: 5, t: 0.7, side: "Long", name: "Meridian Industrial", ticker: "MRDN", sizePct: 1.5, pnlBps: 138,
    thesis: "Priced for bankruptcy with two years of liquidity on the balance sheet. At the lows the checklist said buy. I bought.",
    different: "I bought 1.5%. The checklist said 4%. Fear sized the position, not the process. This one trade left about 250 bps on the table.",
  },
];

const T2020: Trade[] = [
  {
    id: 1, t: 0.03, side: "Hedge", name: "Index put spread", ticker: "IDX-P", sizePct: 1.2, pnlBps: 176,
    thesis: "Case counts in Lombardy and supply chains out of Hubei were not in the price. A cheap hedge relative to what was at stake. Premium of 1.2% against a book that could lose 15%.",
    different: "Bigger. I paid 1.2% for protection against a risk I thought was fat-tailed, then hedged as if it were normal. If you believe the tail, own the tail.",
  },
  {
    id: 2, t: 0.1, side: "Short", name: "Seabright Cruise Lines", ticker: "SBCL", sizePct: 3, pnlBps: 148,
    thesis: "Ships are floating petri dishes with a fixed cost base and a debt schedule. Bookings could go to zero faster than lenders could say 'covenant'.",
    different: "Held it longer. I covered into the first rebound and watched it fall a further 30%. Right idea, premature exit.",
  },
  {
    id: 3, t: 0.15, side: "Cut", name: "Gross exposure 55% to 25%", ticker: "BOOK", sizePct: 30, pnlBps: 64,
    thesis: "Liquidity was disappearing in things that should never be illiquid. I cut the book to a size I could manage on a bad week, and a bad week was exactly what was coming.",
    different: "The cut was right. The missing half of the plan was a rule for getting back in. I wrote the exit in February and the re-entry in no month at all.",
  },
  {
    id: 4, t: 0.23, side: "Hold", name: "Sat in cash through the first leg up", ticker: "CASH", sizePct: 75, pnlBps: -310,
    thesis: "I told myself I'd rebuy 'when things calmed down'. They calmed down 18% higher. This is the trade that explains why my fund lags in sharp V-shaped recoveries.",
    different: "Write the re-entry rule while calm: rebuy a third at each +10% off the low. Mood is not a rule. It was a rule I owed myself and didn't write.",
  },
  {
    id: 5, t: 0.5, side: "Long", name: "Halden Digital Infrastructure", ticker: "HDIN", sizePct: 4, pnlBps: 150,
    thesis: "The pandemic pulled five years of cloud migration into five months. A long-duration winner with, for once, a real balance sheet.",
    different: "Fine, though I should be honest: I got this right by following the crowd, a few weeks late. A good trade, not a good process.",
  },
];

const T2022: Trade[] = [
  {
    id: 1, t: 0.02, side: "Short", name: "Verity Cloud", ticker: "VRTY", sizePct: 3, pnlBps: 205,
    thesis: "Priced at 14x sales with all of the cash arriving in year ten. Move the discount rate by 100 bps and the maths falls over. Nobody in the room was discounting at all.",
    different: "Held the full position longer. I covered half at the June low, with 80% of the move behind it. Still the best thesis I had that year.",
  },
  {
    id: 2, t: 0.18, side: "Long", name: "Cobalt Energy Partners", ticker: "CBEP", sizePct: 5, pnlBps: 176,
    thesis: "Underinvestment for a decade, a war, and a supply chain with no spare capacity. Cash flow at $90 oil covers the whole capital structure twice.",
    different: "I sold in July for a 30% gain. It doubled by year-end. Selling a thesis because the gain is big is a feeling, not a reason.",
  },
  {
    id: 3, t: 0.27, side: "Cut", name: "18% of the book into T-bills", ticker: "UST-6M", sizePct: 18, pnlBps: 64,
    thesis: "Cash had options and, for the first time in a decade, a yield. Dry powder only counts if you have it when something is cheap.",
    different: "I wish I'd done it at 25%. Cash does not feel clever in a bull market and feels brilliant in a bear market, and by then you're out of time.",
  },
  {
    id: 4, t: 0.62, side: "Long", name: "Halden Software", ticker: "HLDN", sizePct: 3, pnlBps: -130,
    thesis: "A bear-market rally in August. 'Growth at a reasonable price' with a founder I trusted. I priced the cash flows carefully and forgot the discount rate entirely.",
    different: "Every long has a duration, and I'd just spent the year shorting exactly that. I took a long position in the same risk I was short. Own the contradiction or fix it.",
  },
  {
    id: 5, t: 0.8, side: "Long", name: "Index call spreads", ticker: "IDX-C", sizePct: 1, pnlBps: 92,
    thesis: "Sentiment at the point of maximum pessimism: fund managers at record low equity weights, and I'd become one of them. Defined risk, asymmetric reward.",
    different: "Larger, and sooner. By October my own book was more bearish than the data. That's the cue to look the other way.",
  },
];

export function buildCustom(p: CustomParams): Scenario {
  const recover = Math.max(3, Math.round(p.fallMonths * 0.8) + 2);
  const total = p.fallMonths + recover;
  const ta = p.fallMonths / total;
  const trough = 100 * (1 - p.drop / 100);
  const end = trough + (100 - trough) * (p.rebound / 100);
  const anchors: Anchor[] = [[0, 100], [ta, trough], [1, end]];
  const vol = 0.005 + (p.drop / 100) * 0.007 + (1 / p.fallMonths) * 0.003;
  const series = simulate(anchors, vol, FUND, 7);
  const m = (t: number) => (t * total).toFixed(t === 0 ? 0 : 1);
  const trades: Trade[] = [
    {
      id: 1, t: Math.min(0.05, ta * 0.25), side: "Cut", name: "Net exposure to 40%", ticker: "BOOK", sizePct: 40, pnlBps: Math.round(p.drop * 3.2),
      thesis: `Your custom scenario has the benchmark falling ${p.drop}% over ${p.fallMonths} months. The first rule is mine: my book is built to lose roughly half of what the market loses, so I start from a net exposure I can live with.`,
      different: "I always find the first cut too small. I'd go lower the moment I see credit spreads move before equities do.",
    },
    {
      id: 2, t: ta * 0.55, side: "Hedge", name: "Index put spread", ticker: "IDX-P", sizePct: 1.2, pnlBps: Math.round(p.drop * 2.4),
      thesis: "Pay a small, known premium for protection. I don't need to be a hero on the way down. I only need not to be forced to sell at the bottom.",
      different: "Hedges bought after the first leg down are expensive. I'd buy them in calm, boring weeks, when they're cheap and no one wants them.",
    },
    {
      id: 3, t: ta + 0.02, side: "Hold", name: "Stay in cash at the low", ticker: "CASH", sizePct: 60, pnlBps: -Math.round(p.rebound * 3.1),
      thesis: "This is the one I do badly. At the trough my book is still defensive and I don't believe the first rebound. In a V-shaped recovery my fund lags, and the slider shows it.",
      different: "A pre-written re-entry rule: rebuy a third at each +10% off the low, regardless of how I feel about it.",
    },
    {
      id: 4, t: Math.min(0.95, ta + (1 - ta) * 0.5), side: "Long", name: "Rebuy a third of the book", ticker: "BOOK", sizePct: 20, pnlBps: Math.round(p.rebound * 1.6),
      thesis: "Once the market has recovered a quarter of its loss I'm back in size, in the companies whose balance sheets survived. Late, dutiful, and mostly right.",
      different: "Earlier. Always earlier. The best entries look like terrible ideas on the day.",
    },
  ];
  return {
    id: "custom",
    label: "Custom",
    sub: "Your own crash",
    blurb: `${p.drop}% drop in ${p.fallMonths} months, then ${p.rebound}% of it back.`,
    series,
    trades,
    labelAt: (t, long) => (long ? `Month ${m(t)}` : `M${Math.round(t * total)}`),
  };
}

function build(
  id: ScenarioId,
  label: string,
  sub: string,
  blurb: string,
  start: Date,
  days: number,
  anchors: Anchor[],
  vol: number,
  fp: FundParams,
  seed: number,
  trades: Trade[],
): Scenario {
  return {
    id, label, sub, blurb,
    series: simulate(anchors, vol, fp, seed),
    trades,
    labelAt: dateLabeler(start, days),
  };
}

export const HISTORIC: Record<"2008" | "2020" | "2022", Scenario> = {
  "2008": build(
    "2008", "2008", "Global financial crisis",
    "Sept 2008 to June 2009. Credit froze, banks failed, the index lost nearly half.",
    new Date(2008, 8, 2), 185, A2008, 0.011,
    { base: 0.46, cut: 0.5, alpha: 0.0003, idio: 0.004 }, 11, T2008,
  ),
  "2020": build(
    "2020", "2020", "The pandemic crash",
    "Feb to Sept 2020. Thirty-three percent in 23 trading days, then the fastest recovery on record.",
    new Date(2020, 1, 19), 140, A2020, 0.012,
    { base: 0.52, cut: 0.75, alpha: 0.0004, idio: 0.0045 }, 5, T2020,
  ),
  "2022": build(
    "2022", "2022", "The rate shock",
    "All of 2022. Inflation, rate hikes, a year where stocks and bonds fell together.",
    new Date(2022, 0, 3), 250, A2022, 0.0085,
    { base: 0.52, cut: 0.35, alpha: -0.0002, idio: 0.0035 }, 3, T2022,
  ),
};
