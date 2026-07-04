"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Ripple = {
  x: number;
  y: number;
  t: number;
  threads: { angle: number; len: number }[];
};

/* Параметры из DESIGN.md §4.5 */
const LIFE = 2000; // нити тают ~2s
const GROW = 350; // разбег нитей, мс
const TAP_DIST = 10; // больше — это свайп, не срабатываем
const TAP_TIME = 350;

/**
 * Touch-замены desktop-эффектов (DESIGN.md §4.5):
 *  - tap-ripple вместо web-trail: касание создаёт узел, 4–6 нитей тают за ~2s
 *  - skew заголовков [data-skew] от скорости скролла (2–4°, упругий возврат)
 *  - haptics: vibrate(10) на переходах к кейсам (iOS тихо игнорирует)
 */
export function MobileFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let ripples: Ripple[] = [];
    let dirty = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* tap-ripple: срабатывает на tap, НЕ на свайп */
    let start: { x: number; y: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      start = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !start) return;
      const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      const held = performance.now() - start.t;
      start = null;
      if (moved > TAP_DIST || held > TAP_TIME) return;
      const count = 4 + Math.floor(Math.random() * 3); // 4–6 нитей
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
        threads: Array.from({ length: count }, (_, i) => ({
          angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8,
          len: 45 + Math.random() * 50,
        })),
      });
    };

    const draw = () => {
      const now = performance.now();
      ripples = ripples.filter((r) => now - r.t < LIFE);
      if (!ripples.length) {
        if (dirty) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          dirty = false;
        }
        return;
      }
      dirty = true;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineWidth = 0.7;
      for (const r of ripples) {
        const age = now - r.t;
        const grow = Math.min(1, age / GROW);
        const fade = 1 - age / LIFE;
        ctx.strokeStyle = `rgba(245,245,240,${0.34 * fade})`;
        for (const th of r.threads) {
          const len = th.len * grow;
          const ex = r.x + Math.cos(th.angle) * len;
          const ey = r.y + Math.sin(th.angle) * len;
          const sag = Math.min(len * 0.12, 14);
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.quadraticCurveTo((r.x + ex) / 2, (r.y + ey) / 2 + sag, ex, ey);
          ctx.stroke();
        }
        if (age < 500) {
          ctx.fillStyle = `rgba(245,245,240,${0.7 * (1 - age / 500)})`;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    gsap.ticker.add(draw);

    /* skew заголовков от скорости скролла, упругий возврат */
    const clampSkew = gsap.utils.clamp(-3.5, 3.5);
    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter("[data-skew]", "skewY", "deg");
    const st = ScrollTrigger.create({
      onUpdate(self) {
        const skew = clampSkew(self.getVelocity() / -400);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => skewSetter(proxy.skew),
          });
        }
      },
    });

    /* haptics на переходе к кейсу */
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.('a[href^="/cases/"]')) {
        navigator.vibrate?.(10);
      }
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", resize);
    document.addEventListener("click", onClick);
    return () => {
      gsap.ticker.remove(draw);
      st.kill();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    // z-0 как у CursorWeb: tap-ripple под карточками, поверх фона
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
