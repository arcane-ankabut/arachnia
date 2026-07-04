import Link from "next/link";
import { CardGleam } from "@/components/motion/CardGleam";
import type { CaseMeta } from "@/lib/cases";
import { MonoLabel } from "./MonoLabel";

/**
 * Карточка кейса (COPY.md §6). Верхняя зона — под будущее видео/фото кейса,
 * пока там типографический водяной знак; параллакс добавится вместе с медиа.
 */
export function CaseCard({
  item,
  index,
  featured = false,
}: {
  item: CaseMeta;
  index: number;
  featured?: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  const displayClass =
    item.display === "sans"
      ? "font-sans font-extrabold tracking-tight"
      : "font-display tracking-[-0.01em]";

  return (
    <Link
      href={`/cases/${item.slug}`}
      data-reveal-item
      data-cursor="view"
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-hairline bg-surface"
    >
      {/* медиа-зона (пока плейсхолдер) */}
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-surface-2 ${
          featured ? "aspect-[16/8] md:aspect-[21/8]" : "aspect-[16/10]"
        }`}
      >
        <span
          aria-hidden
          className={`select-none whitespace-nowrap uppercase leading-none text-bone/[0.06] transition-transform duration-500 group-hover:scale-105 ${displayClass} ${
            featured ? "text-[16vw] md:text-[11vw]" : "text-[15vw] md:text-[5.5vw]"
          }`}
        >
          {item.title}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <MonoLabel className="text-muted">[ {num} ]</MonoLabel>
          <MonoLabel className="normal-case text-muted">( {item.tags} )</MonoLabel>
        </div>

        <h3
          className={`uppercase leading-none transition-colors duration-300 md:group-hover:text-accent ${displayClass} ${
            featured
              ? "text-[clamp(36px,5vw,84px)]"
              : "text-[clamp(28px,3.2vw,56px)]"
          }`}
        >
          {item.title}
        </h3>

        <p>
          <MonoLabel className="normal-case text-muted">{item.services}</MonoLabel>
        </p>
      </div>

      <CardGleam />
    </Link>
  );
}
