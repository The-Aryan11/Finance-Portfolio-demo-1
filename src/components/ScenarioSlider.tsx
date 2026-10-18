import type { ScenarioId } from "../data/scenarios";

const STOPS: { id: ScenarioId; label: string; sub: string }[] = [
  { id: "2008", label: "2008", sub: "Financial crisis" },
  { id: "2020", label: "2020", sub: "Pandemic crash" },
  { id: "2022", label: "2022", sub: "Rate shock" },
  { id: "custom", label: "Custom", sub: "Your own crash" },
];

const THUMB = 22;

export default function ScenarioSlider({ value, onChange }: { value: ScenarioId; onChange: (id: ScenarioId) => void }) {
  const idx = STOPS.findIndex((s) => s.id === value);
  const left = (i: number) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${i / (STOPS.length - 1)})`;

  return (
    <div className="px-4 sm:px-8">
      <div className="relative">
        <input
          type="range"
          min={0}
          max={STOPS.length - 1}
          step={1}
          value={idx}
          onChange={(e) => onChange(STOPS[Number(e.target.value)].id)}
          aria-label="Market scenario"
          aria-valuetext={`${STOPS[idx].label}, ${STOPS[idx].sub}`}
          className="ruler relative z-10"
        />
        {STOPS.map((s, i) => (
          <span
            key={s.id}
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-3 w-px -translate-y-1/2 bg-(--color-ink)"
            style={{ left: left(i) }}
          />
        ))}
      </div>
      <div className="relative h-14 sm:h-12">
        {STOPS.map((s, i) => {
          const on = i === idx;
          return (
            <button
              key={s.id}
              onClick={() => onChange(s.id)}
              className="absolute top-0 -translate-x-1/2 px-2 py-1 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-accent)"
              style={{ left: left(i) }}
              aria-pressed={on}
            >
              <span className={`num block text-base sm:text-lg ${on ? "text-(--color-accent) font-medium" : "text-(--color-ink)"}`}>
                {s.label}
              </span>
              <span className={`block text-[0.7rem] leading-tight whitespace-nowrap sm:text-sm ${on ? "text-(--color-ink)" : "text-(--color-muted)"}`}>
                {s.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
