"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Pt = { x: number; y: number; t: number };
type Thread = { a: Pt; b: Pt; t: number };

/* Параметры из DESIGN.md §3 (cursor web-trail) */
const STEP = 14; // мин. шаг курсора для новой точки, px
const LIFE = 3000; // жизнь нити, мс
const FLASH = 500; // вспышка узла, мс
const MAX_PTS = 90; // буфер точек
const LINK_MIN = 30; // радиус связи с недавними точками, px
const LINK_MAX = 130;
const JUMP = 160; // прыжок курсора больше этого рвёт прядь (скролл, выход за окно)

/**
 * Сквозной фирменный эффект: паутина плетётся за курсором.
 * Только pointer: fine и без prefers-reduced-motion; canvas 2D,
 * pointer-events: none, рисование в общем тикере GSAP (один rAF-цикл).
 */
export function CursorWeb() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let pts: Pt[] = [];
    let threads: Thread[] = [];
    let last: Pt | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      const step = last ? Math.hypot(x - last.x, y - last.y) : Infinity;
      if (step < STEP) return;
      const now = performance.now();
      const p: Pt = { x, y, t: now };

      if (last && step <= JUMP) threads.push({ a: last, b: p, t: now });

      // + 1–2 нити к случайным недавним точкам в радиусе 30–130px
      const wanted = 1 + (Math.random() < 0.4 ? 1 : 0);
      const nearby = pts.slice(-24).filter((q) => {
        const d = Math.hypot(x - q.x, y - q.y);
        return d >= LINK_MIN && d <= LINK_MAX;
      });
      for (let i = 0; i < wanted && nearby.length; i++) {
        const [q] = nearby.splice(Math.floor(Math.random() * nearby.length), 1);
        threads.push({ a: q, b: p, t: now });
      }

      pts.push(p);
      if (pts.length > MAX_PTS) pts = pts.slice(-MAX_PTS);
      last = p;
    };

    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      threads = threads.filter((th) => now - th.t < LIFE);
      ctx.lineWidth = 0.7;
      for (const th of threads) {
        const fade = 1 - (now - th.t) / LIFE;
        const len = Math.hypot(th.b.x - th.a.x, th.b.y - th.a.y);
        const sag = Math.min(len * 0.12, 14); // провисание — эффект шёлка
        ctx.strokeStyle = `rgba(245,245,240,${0.34 * fade})`;
        ctx.beginPath();
        ctx.moveTo(th.a.x, th.a.y);
        ctx.quadraticCurveTo(
          (th.a.x + th.b.x) / 2,
          (th.a.y + th.b.y) / 2 + sag,
          th.b.x,
          th.b.y,
        );
        ctx.stroke();
      }

      // узлы вспыхивают при появлении и гаснут
      for (const p of pts) {
        const age = now - p.t;
        if (age > FLASH) continue;
        ctx.fillStyle = `rgba(245,245,240,${0.7 * (1 - age / FLASH)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    gsap.ticker.add(draw);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);
    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    // z-0: нити рисуются под позиционированными блоками (карточки кейсов),
    // но поверх фона и обычного текстового потока
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
