const ITEMS = [
  "Past performance is a story I tell with hindsight. Read it the way you'd read a menu in a language you only half speak.",
  "I will be wrong, roughly four times in ten, and usually loudly. The trick is to be wrong in small sizes.",
  "Diversification is the only free lunch in finance, and also the one almost nobody stays to finish.",
  "Everything on this page is illustrative, simulated, and written by someone who has never met your risk tolerance.",
  "If a number here makes you feel certain, close the tab and come back after a walk.",
];

export default function Disclosure() {
  return (
    <footer id="disclosure" className="border-t-[3px] border-double border-(--color-ink)">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-20 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5" data-reveal>
          <p className="label mb-4">04 &middot; Risk disclosure</p>
          <h2 className="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl">
            In my own words, <span className="italic text-(--color-accent)">not my lawyer&rsquo;s.</span>
          </h2>
          <p className="mt-6 text-[1.05rem] leading-relaxed">
            If you&rsquo;d like to talk about an allocation, or tell me about a loss of your own, I read every email myself.
          </p>
          <a
            href="mailto:maya@iyerpartners.example"
            className="num mt-6 inline-block border border-(--color-ink) bg-(--color-ink) px-6 py-3.5 text-sm text-(--color-paper) transition hover:bg-(--color-accent) hover:border-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-accent)"
          >
            maya@iyerpartners.example
          </a>
        </div>

        <div className="md:col-span-7">
          <ol className="border-t border-(--color-ink)">
            {ITEMS.map((t, i) => (
              <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-(--color-rule) py-5" data-reveal>
                <span className="num text-sm text-(--color-accent)">{i + 1}.</span>
                <p className="text-[1.08rem] leading-relaxed">{t}</p>
              </li>
            ))}
          </ol>
          <p className="font-display mt-8 text-xl italic">
            &mdash; M.I., who still checks prices at 6 a.m. and has made her peace with it.
          </p>
        </div>
      </div>

      <div className="border-t border-(--color-rule)">
        <p className="num mx-auto max-w-[1240px] px-5 py-5 text-xs text-(--color-muted) sm:px-8">
          Demo site. Maya Iyer, Iyer Partners and every security named here are fictional. Figures are illustrative and simulated. Not investment advice, not an offer.
        </p>
      </div>
    </footer>
  );
}
