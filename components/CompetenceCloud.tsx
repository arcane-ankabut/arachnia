"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MonoLabel } from "@/components/ui/MonoLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Облако микро-меток компетенций (DESIGN.md §3) вокруг центрального элемента.
   Правая половина якорится через right, чтобы не обрезаться на узких экранах. */
const CLOUD: { text: string; style: React.CSSProperties }[] = [
  { text: "brand identity", style: { top: "12%", left: "8%" } },
  { text: "motion", style: { top: "16%", right: "8%" } },
  { text: "crm", style: { top: "38%", left: "5%" } },
  { text: "чат-боты", style: { top: "7%", left: "40%" } },
  { text: "perf-маркетинг", style: { top: "78%", left: "12%" } },
  { text: "ии-видео", style: { top: "88%", left: "30%" } },
  { text: "продакшн", style: { top: "60%", right: "6%" } },
  { text: "консалтинг", style: { top: "84%", right: "8%" } },
  { text: "генеративный визуал", style: { top: "68%", left: "28%" } },
  { text: "e-commerce", style: { top: "30%", right: "5%" } },
];

/**
 * Центральный знак ARACHNIA + плавающие подписи компетенций.
 * Лёгкая секция без WebGL; при prefers-reduced-motion всё статично.
 */
export function CompetenceCloud() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, {
            y: 10 + (i % 3) * 6,
            x: i % 2 ? 9 : -9,
            duration: 3.2 + (i % 4) * 0.7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
        gsap.from("[data-cloud-mark]", {
          autoAlpha: 0,
          scale: 0.96,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 70%" },
        });
      });
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="relative flex h-[70vh] min-h-[480px] items-center justify-center overflow-hidden"
    >
      <div
        data-cloud-mark
        className="text-center font-display text-[clamp(48px,9vw,150px)] uppercase leading-none tracking-[-0.01em]"
      >
        ARACHNIA
      </div>

      {CLOUD.map((item) => (
        <span
          key={item.text}
          data-float
          aria-hidden
          className="absolute whitespace-nowrap"
          style={item.style}
        >
          <MonoLabel className="normal-case text-muted/70">( {item.text} )</MonoLabel>
        </span>
      ))}
    </div>
  );
}
