import type { ReactNode } from "react";

type MonoLabelProps = {
  /** Крупная EN-часть, uppercase */
  en?: string;
  /** RU-пара, выводится в скобках строчными */
  ru?: string;
  className?: string;
  /** Произвольное моно-содержимое вместо пары en/ru */
  children?: ReactNode;
};

/**
 * Служебная моно-метка (DESIGN.md §2): `EN ( ru )`, `[ 00 ]`, `EST_2026`.
 * Без en выводится только `( ru )`.
 */
export function MonoLabel({ en, ru, className = "", children }: MonoLabelProps) {
  return (
    <span
      className={`font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] ${className}`}
    >
      {children ?? (
        <>
          {en}
          {en && ru ? " " : null}
          {ru ? <span className="normal-case text-muted">( {ru} )</span> : null}
        </>
      )}
    </span>
  );
}
