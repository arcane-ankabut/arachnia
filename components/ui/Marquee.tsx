import type { CSSProperties } from "react";

type MarqueeItem = { en: string; ru: string };

type MarqueeProps = {
  items: MarqueeItem[];
  reverse?: boolean;
  className?: string;
  /** Длительность полного цикла, сек */
  duration?: number;
};

function Lane({ items, hidden }: { items: MarqueeItem[]; hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex w-max items-baseline">
      {items.map((item, i) => (
        <span key={i} className="flex items-baseline whitespace-nowrap">
          <span>{item.en}</span>
          <span className="mx-[0.3em] font-mono text-[0.22em] normal-case text-muted">
            ( {item.ru} )
          </span>
          <span aria-hidden className="mx-[0.3em] text-[0.4em] text-muted">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

/** Бегущая лента услуг (DESIGN.md §3, COPY.md §3). Размер текста задаётся className. */
export function Marquee({ items, reverse, className = "", duration = 36 }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={`marquee-track flex w-max items-baseline font-display uppercase leading-none ${
          reverse ? "marquee-reverse" : ""
        }`}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <Lane items={items} />
        <Lane items={items} hidden />
      </div>
    </div>
  );
}
