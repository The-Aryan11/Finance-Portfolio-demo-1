export interface Asset {
  title: string;
  note: string;
  bps: number;
}

export interface Loss {
  no: number;
  year: string;
  title: string;
  meta: string;
  bps: number;
  thought: string;
  happened: string;
  taught: string;
  rule: string;
}

export const ASSETS: Asset[] = [
  {
    title: "The bank short, 2008",
    note: "Read the loan-book footnotes six months before anyone priced them. Short regional lenders with thin reserves.",
    bps: 640,
  },
  {
    title: "Forensic accounting",
    note: "Ten years of reading the part of the filing nobody reads. Flagged four restatements before they were announced.",
    bps: 520,
  },
  {
    title: "Cash through 2021",
    note: "Held 18% in bills while it felt foolish. It paid for itself in 2022, and it paid for the nerve.",
    bps: 480,
  },
  {
    title: "Position-size limits",
    note: "No single name above 6% of NAV, no binary event above 1.5%. Written down in 2018 and enforced on myself since.",
    bps: 300,
  },
  {
    title: "Bad news first",
    note: "Client letters go out on time, in every drawdown, before the headlines do. No forced redemptions in 2020.",
    bps: 200,
  },
];

export const LOSSES: Loss[] = [
  {
    no: 1,
    year: "2011",
    title: "Pinecrest Solar",
    meta: "Long · held 14 months · 6.1% of NAV at its peak",
    bps: 412,
    thought: "Subsidy-backed, cheap on earnings, a management team that said all the right things on every call.",
    happened: "Three guidance cuts, and I averaged down after each one. The subsidy was repealed in year two. The stock lost 83%, and so did my sense of humour about it.",
    taught: "Cheap is not a thesis. Averaging down is a new decision and needs a new thesis, written fresh, as if I didn't own it already.",
    rule: "Every add to a loser requires a one-page re-underwrite, signed by someone who isn't me.",
  },
  {
    no: 2,
    year: "2015",
    title: "Meridian Shipping",
    meta: "Short · held 9 months · 4.0% of NAV",
    bps: 318,
    thought: "A hated sector with weak freight rates, old ships and a CEO who sold into every rally. Easy.",
    happened: "I was right about the business and wrong about the stock. A takeover rumour at +34% overnight. I stayed in because I was 'right', and was squeezed twice more.",
    taught: "Right and early is wrong. Short positions are sized by what a squeeze would cost, not by how certain I feel.",
    rule: "Short positions are capped at what a 40% adverse move would cost the fund. Conviction doesn't enter the formula.",
  },
  {
    no: 3,
    year: "2018",
    title: "Northgate Biotech",
    meta: "Long · held 6 weeks · 6.0% of NAV",
    bps: 264,
    thought: "Phase III trial with a strong Phase II, a clean mechanism and a lead investigator I'd met and liked.",
    happened: "The trial missed its endpoint by a hair. The stock gapped 44% on the open and I couldn't have sold if I'd tried. I had sized a coin flip like a conviction.",
    taught: "Conviction is not a position size. A binary event deserves a binary-sized bet, and I'd never have put 6% on a coin with a nice story.",
    rule: "No binary event above 1.5% of NAV, whatever I think the odds are.",
  },
  {
    no: 4,
    year: "2020",
    title: "Selling the bottom",
    meta: "Cash · March–April 2020 · 75% of the book",
    bps: 186,
    thought: "Protect capital first. I'd cut the book to a quarter of its size, a right call, and I told myself I'd rebuy when things calmed down.",
    happened: "They calmed down 18% higher. I sat out the sharpest rebound in the index's history, then chased it. The de-risking was right; the missing re-entry plan wasn't.",
    taught: "A de-risk rule written in a calm week should be followed in a bad one, and reversed by a rule rather than a mood.",
    rule: "Every cut comes with a pre-written re-entry schedule: a third back at each +10% off the low.",
  },
  {
    no: 5,
    year: "2022",
    title: "Halden Software",
    meta: "Long · held 5 months · 3.0% of NAV",
    bps: 130,
    thought: "A bear-market rally in August. Quality growth at a fair price, with a founder I trusted.",
    happened: "I priced the cash flows carefully and forgot the discount rate. It fell 41% in the autumn, in the same year I was shorting exactly that kind of long-duration risk elsewhere.",
    taught: "Every long has a duration. I was long the thing I was short, and I only noticed because the P&L told me.",
    rule: "Quarterly duration audit: if the long book and the short book disagree about rates, one of them goes.",
  },
];

export interface YearRow {
  year: number;
  bench: number;
  fund: number;
}

export const RECORD: YearRow[] = [
  { year: 2016, bench: 12.0, fund: 7.1 },
  { year: 2017, bench: 21.8, fund: 11.4 },
  { year: 2018, bench: -4.4, fund: -1.2 },
  { year: 2019, bench: 31.5, fund: 15.9 },
  { year: 2020, bench: 18.4, fund: 5.2 },
  { year: 2021, bench: 28.7, fund: 13.6 },
  { year: 2022, bench: -18.1, fund: -6.4 },
  { year: 2023, bench: 26.3, fund: 12.8 },
  { year: 2024, bench: 25.0, fund: 14.1 },
  { year: 2025, bench: 17.9, fund: 9.7 },
];
