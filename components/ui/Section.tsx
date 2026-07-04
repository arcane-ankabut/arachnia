import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Без внутренних отступов — для полноширинных списков/лент */
  flush?: boolean;
};

/** Секция с тонкой линией-разделителем сверху (DESIGN.md §1). */
export function Section({ children, className = "", id, flush = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`border-t border-hairline ${
        flush ? "" : "px-5 py-20 md:px-8 md:py-28"
      } ${className}`}
    >
      {children}
    </section>
  );
}
