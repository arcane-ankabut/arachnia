"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MonoLabel } from "@/components/ui/MonoLabel";

gsap.registerPlugin(useGSAP);

type Pt = { x: number; y: number; t: number };
type Thread = { a: Pt; b: Pt; t: number };

/**
 * Автономная паутина прелоадера (DESIGN.md §3, v2): плетётся от центра
 * к краям, скорость привязана к счётчику WEAVING; на 100 сеть готова.
 * Визуальный язык тот же, что у cursor web-trail (sag, вспышки узлов, 0.7px).
 */
function createPreloaderWeb(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.hypot(w, h) / 2 + 40;
  const STRANDS = 9;
  const STEP = 26;
  const stepsMax = Math.ceil(maxR / STEP);

  const center: Pt = { x: cx, y: cy, t: performance.now() };
  const all: Pt[] = [center];
  const threads: Thread[] = [];
  const strands = Array.from({ length: STRANDS }, (_, i) => ({
    angle: (Math.PI * 2 * i) / STRANDS + (Math.random() - 0.5) * 0.4,
    pts: [center] as Pt[],
  }));

  let progress = 0; // 0..1, снаружи — от счётчика WEAVING

  const spawn = () => {
    const now = performance.now();
    const target = 1 + Math.floor(progress * stepsMax);
    for (const s of strands) {
      while (s.pts.length < target) {
        const last = s.pts[s.pts.length - 1];
        const a = s.angle + (Math.random() - 0.5) * 0.6;
        const step = STEP * (0.8 + Math.random() * 0.5);
        const p: Pt = { x: last.x + Math.cos(a) * step, y: last.y + Math.sin(a) * step, t: now };
        threads.push({ a: last, b: p, t: now });
        // поперечные нити к случайным недавним точкам (как у web-trail)
        if (Math.random() < 0.3) {
          const near = all.filter((q) => {
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            return d >= 30 && d <= 130;
          });
          if (near.length) {
            threads.push({ a: near[Math.floor(Math.random() * near.length)], b: p, t: now });
          }
        }
        s.pts.push(p);
        all.push(p);
      }
    }
  };

  const draw = () => {
    const now = performance.now();
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 0.7;
    for (const th of threads) {
      const age = now - th.t;
      const flash = age < 400 ? (1 - age / 400) * 0.2 : 0; // вспышка при появлении
      ctx.strokeStyle = `rgba(245,245,240,${0.26 + flash})`;
      const len = Math.hypot(th.b.x - th.a.x, th.b.y - th.a.y);
      const sag = Math.min(len * 0.12, 14);
      ctx.beginPath();
      ctx.moveTo(th.a.x, th.a.y);
      ctx.quadraticCurveTo((th.a.x + th.b.x) / 2, (th.a.y + th.b.y) / 2 + sag, th.b.x, th.b.y);
      ctx.stroke();
    }
    for (const p of all) {
      const age = now - p.t;
      if (age > 500) continue;
      ctx.fillStyle = `rgba(245,245,240,${0.7 * (1 - age / 500)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const tick = () => {
    spawn();
    draw();
  };
  gsap.ticker.add(tick);

  return {
    setProgress(v: number) {
      progress = v;
    },
    stop() {
      gsap.ticker.remove(tick);
    },
  };
}

/**
 * Прелоадер-сцена (DESIGN.md §3) + передача эстафеты hero.
 * Дочерние элементы помечаются:
 *  - [data-hero-line] — строки заголовка (выезд снизу из overflow-hidden)
 *  - [data-hero-fade] — метки/подстроки (autoAlpha + y)
 * Начальные скрытые состояния ставятся ТОЛЬКО из JS: без JS контент виден,
 * а сам оверлей гасится через <noscript> в layout.
 */
export function IntroSequence({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-preloader]", { display: "none" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counterEl = scope.current?.querySelector("[data-counter]");
        const counter = { value: 0 };

        const web = canvasRef.current ? createPreloaderWeb(canvasRef.current) : null;

        gsap.set("[data-hero-line]", { yPercent: 110 });
        gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 12 });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from("[data-preloader-logo]", {
          autoAlpha: 0,
          yPercent: 18,
          duration: 0.7,
        })
          .from(
            "[data-preloader-label]",
            { autoAlpha: 0, duration: 0.45, stagger: 0.07, ease: "none" },
            "<0.15",
          )
          .to(
            counter,
            {
              value: 100,
              duration: 2,
              ease: "power2.inOut",
              snap: { value: 1 },
              onUpdate: () => {
                if (counterEl) {
                  counterEl.textContent = String(Math.round(counter.value)).padStart(3, "0");
                }
                web?.setProgress(counter.value / 100);
              },
            },
            "-=0.2",
          )
          .to(
            "[data-preloader-logo], [data-preloader-label]",
            { autoAlpha: 0, duration: 0.35, ease: "power1.out" },
            "+=0.25",
          )
          .to(
            "[data-preloader]",
            { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
            "-=0.15",
          )
          .set("[data-preloader]", { display: "none" })
          .call(() => web?.stop())
          .to(
            "[data-hero-line]",
            { yPercent: 0, duration: 1.1, stagger: 0.14 },
            "-=0.5",
          )
          .to(
            "[data-hero-fade]",
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" },
            "-=0.7",
          );

        return () => web?.stop();
      });
    },
    { scope },
  );

  return (
    <div ref={scope}>
      {/* Прелоадер — COPY.md §1 */}
      <div
        data-preloader
        className="fixed inset-0 z-50 flex items-center justify-center bg-void"
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />

        <div
          data-preloader-label
          className="absolute left-5 top-5 z-10 md:left-8 md:top-8"
        >
          <MonoLabel className="text-muted">[ 00 ]&nbsp;&nbsp;INDEX.HTML</MonoLabel>
        </div>
        <div
          data-preloader-label
          className="absolute right-5 top-5 z-10 text-right md:right-8 md:top-8"
        >
          <MonoLabel className="text-muted">ALMATY / 43.2°N 76.9°E</MonoLabel>
        </div>
        <div
          data-preloader-label
          className="absolute bottom-5 left-5 z-10 md:bottom-8 md:left-8"
        >
          <MonoLabel className="text-muted">AI-DRIVEN STUDIO</MonoLabel>
        </div>
        <div
          data-preloader-label
          className="absolute bottom-5 right-5 z-10 text-right md:bottom-8 md:right-8"
        >
          <MonoLabel className="text-muted">EST. 2026 ©</MonoLabel>
        </div>

        <span
          data-preloader-logo
          className="relative z-10 font-display text-[13vw] uppercase leading-none tracking-[-0.01em] md:text-[11vw]"
        >
          ARACHNIA
        </span>

        <div
          data-preloader-label
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 md:bottom-8"
        >
          <MonoLabel className="text-muted">
            WEAVING — <span data-counter className="text-bone">000</span>
          </MonoLabel>
        </div>
      </div>

      {children}
    </div>
  );
}
