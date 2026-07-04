"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Reveal on scroll (DESIGN.md §3). Внутри помечать:
 *  - [data-reveal-line] — строки заголовков: выезд снизу из overflow-hidden
 *  - [data-reveal]      — блоки: autoAlpha + y, общий триггер секции
 *  - [data-reveal-item] — элементы длинных списков: свой триггер через batch
 * Скрытие ставится только из JS (gsap.from) — без JS контент виден.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = scope.current!;
        const lines = root.querySelectorAll("[data-reveal-line]");
        const fades = root.querySelectorAll("[data-reveal]");
        const items = root.querySelectorAll("[data-reveal-item]");

        if (lines.length) {
          gsap.from(lines, {
            yPercent: 110,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: { trigger: root, start: "top 75%" },
          });
        }

        if (fades.length) {
          gsap.from(fades, {
            y: 24,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 75%" },
          });
        }

        if (items.length) {
          gsap.set(items, { y: 24, autoAlpha: 0 });
          ScrollTrigger.batch(items, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
              }),
          });
        }
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
