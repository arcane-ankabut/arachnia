"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Кастомный курсор (DESIGN.md §3): точка, увеличение на интерактивных
 * элементах, подпись VIEW на карточках работ ([data-cursor="view"]).
 * На touch и при prefers-reduced-motion не монтируется — остаётся системный.
 */
export function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // При reduced-motion курсор остаётся кастомным (системная стрелка скрыта),
    // но без плавных анимаций — точка следует мгновенно.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!wrap || !dot || !label) return;

    document.documentElement.classList.add("has-custom-cursor");
    // страховка на случай, если CSS-правило не долетело/переопределено
    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const follow = reduce ? 0.001 : 0.25;
    gsap.set(wrap, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const xTo = gsap.quickTo(wrap, "x", { duration: follow, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: follow, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(wrap, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
    };

    const onLeave = () =>
      gsap.to(wrap, { autoAlpha: 0, duration: 0.2, overwrite: "auto" });

    const dur = (v: number) => (reduce ? 0 : v);
    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest?.("a, button, [data-cursor]");
      if (target && (target as HTMLElement).dataset.cursor === "view") {
        gsap.to(dot, { scale: 7, duration: dur(0.3), ease: "power3.out" });
        gsap.to(label, { autoAlpha: 1, duration: dur(0.2), delay: dur(0.05) });
      } else if (target) {
        gsap.to(dot, { scale: 2.5, duration: dur(0.25), ease: "power3.out" });
        gsap.to(label, { autoAlpha: 0, duration: dur(0.15) });
      } else {
        gsap.to(dot, { scale: 1, duration: dur(0.25), ease: "power3.out" });
        gsap.to(label, { autoAlpha: 0, duration: dur(0.15) });
      }
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([wrap, dot, label]);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
    >
      {/* mix-blend-difference: на светлых поверхностях точка инвертируется в тёмную */}
      <div ref={dotRef} className="h-2.5 w-2.5 rounded-full bg-bone mix-blend-difference" />
      <span
        ref={labelRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.08em] text-void opacity-0"
      >
        VIEW
      </span>
    </div>
  );
}
