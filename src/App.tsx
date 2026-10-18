import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StressLab from "./sections/StressLab";
import BalanceSheet from "./sections/BalanceSheet";
import Record from "./sections/Record";
import Disclosure from "./sections/Disclosure";

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  ["Stress test", "#stress-test"],
  ["Balance sheet", "#balance-sheet"],
  ["Record", "#record"],
  ["Disclosure", "#disclosure"],
];

export default function App() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({ lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 18,
          opacity: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".loss-bar").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "top 60%", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.1,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-US")),
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-(--color-ink) bg-(--color-canvas)/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a href="#stress-test" className="font-display text-lg leading-none font-medium">
            Maya Iyer <span className="num ml-1 text-xs font-normal text-(--color-muted)">Fund III</span>
          </a>
          <nav aria-label="Sections" className="hidden gap-7 sm:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="num py-1 text-sm transition hover:text-(--color-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)">
                {label}
              </a>
            ))}
          </nav>
          <p className="label text-(--color-accent)!">Illustrative data</p>
        </div>
      </header>
      <main>
        <StressLab />
        <BalanceSheet />
        <Record />
      </main>
      <Disclosure />
    </>
  );
}
