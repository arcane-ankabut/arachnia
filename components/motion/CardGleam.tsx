"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { isGyroEnabled, subscribeGyro } from "@/lib/gyro";

/**
 * Блик-«голограмма» на карточке кейса (DESIGN.md §4.5): световое пятно
 * ездит по карточке при наклоне телефона. Виден только когда гироскоп
 * реально отдаёт данные; на desktop и без разрешения — невидим.
 */
export function CardGleam() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    const blob = blobRef.current;
    if (!wrap || !blob) return;

    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let active = false;
    let shown = false;

    gsap.set(blob, { xPercent: -50, yPercent: -50 });

    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
    });
    io.observe(wrap);

    const unsub = subscribeGyro(({ beta, gamma }) => {
      if (!shown) {
        shown = true;
        gsap.to(wrap, { autoAlpha: 1, duration: 0.6 });
      }
      target.x = gsap.utils.clamp(-1, 1, gamma / 25);
      target.y = gsap.utils.clamp(-1, 1, (beta - 45) / 25);
    });

    const tick = () => {
      if (!active || !isGyroEnabled()) return;
      pos.x += (target.x - pos.x) * 0.1;
      pos.y += (target.y - pos.y) * 0.1;
      gsap.set(blob, {
        xPercent: -50 + pos.x * 45,
        yPercent: -50 + pos.y * 60,
        force3D: true,
      });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      unsub();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0"
    >
      <div
        ref={blobRef}
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(245,245,240,0.07), transparent 70%)",
        }}
      />
    </div>
  );
}
