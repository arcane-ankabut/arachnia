"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { enableGyro, gyroNeedsPermission, subscribeGyro } from "@/lib/gyro";

gsap.registerPlugin(ScrollTrigger);

/* Амплитуды слоёв, DESIGN.md §4.5: заголовок ±5px, моно-метки ±25px в противофазе */
const AMP_TITLE = 5;
const AMP_LABEL = 25;

/**
 * Гиро-параллакс hero (touch-устройства). Слои помечаются в разметке:
 * [data-gyro="title"] и [data-gyro="label"]. Без разрешения сенсора (iOS) —
 * fallback: параллакс от скролла. Вне вьюпорта — на паузе (IntersectionObserver).
 */
export function HeroGyro() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);
  const [mode, setMode] = useState<"idle" | "gyro" | "scroll">("idle");

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (gyroNeedsPermission()) {
      setShowButton(true);
      setMode("scroll"); // до разрешения — параллакс от скролла
    } else {
      enableGyro().then((ok) => setMode(ok ? "gyro" : "scroll"));
    }
  }, []);

  /* Режим гироскопа: lerp(0.1), опрос ≤60Hz, только transform */
  useEffect(() => {
    if (mode !== "gyro") return;
    const section = hostRef.current?.closest("section");
    if (!section) return;
    const titles = section.querySelectorAll<HTMLElement>('[data-gyro="title"]');
    const labels = section.querySelectorAll<HTMLElement>('[data-gyro="label"]');

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let active = true;
    let lastEvent = 0;

    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
    });
    io.observe(section);

    const unsub = subscribeGyro(({ beta, gamma }) => {
      const now = performance.now();
      if (now - lastEvent < 16) return;
      lastEvent = now;
      target.x = gsap.utils.clamp(-1, 1, gamma / 30);
      target.y = gsap.utils.clamp(-1, 1, (beta - 45) / 30);
    });

    const tick = () => {
      if (!active) return;
      pos.x += (target.x - pos.x) * 0.1;
      pos.y += (target.y - pos.y) * 0.1;
      titles.forEach((el) =>
        gsap.set(el, { x: pos.x * AMP_TITLE, y: pos.y * AMP_TITLE, force3D: true }),
      );
      labels.forEach((el) =>
        gsap.set(el, { x: -pos.x * AMP_LABEL, y: -pos.y * AMP_LABEL, force3D: true }),
      );
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      unsub();
      io.disconnect();
    };
  }, [mode]);

  /* Fallback: параллакс от скролла */
  useEffect(() => {
    if (mode !== "scroll") return;
    const section = hostRef.current?.closest("section");
    if (!section) return;
    const ctx = gsap.context(() => {
      const st = {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to('[data-gyro="title"]', { y: 50, ease: "none", scrollTrigger: st });
      gsap.to('[data-gyro="label"]', { y: -25, ease: "none", scrollTrigger: st });
    }, section);
    return () => ctx.revert();
  }, [mode]);

  async function onEnable() {
    const ok = await enableGyro();
    if (ok) {
      setShowButton(false);
      setMode("gyro");
    }
  }

  return (
    <div ref={hostRef} className="contents">
      {showButton && (
        <button
          type="button"
          onClick={onEnable}
          className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted transition-colors active:text-accent"
        >
          ( ENABLE MOTION ↗ )
        </button>
      )}
    </div>
  );
}
