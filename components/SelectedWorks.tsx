import { Reveal } from "@/components/motion/Reveal";
import { CaseCard } from "@/components/ui/CaseCard";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { getAllCases } from "@/lib/cases";

/** SELECTED WORKS (COPY.md §6): заголовок + полноширинные карточки кейсов. */
export function SelectedWorks({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  const cases = getAllCases();
  const Heading = heading;

  return (
    <Reveal>
      <div className="px-5 pt-20 md:px-8 md:pt-28">
        <Heading
          data-skew
          className="font-display text-[clamp(48px,11vw,180px)] uppercase leading-[0.9] tracking-[-0.01em]"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-reveal-line className="block">
              SELECTED
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-reveal-line className="block">
              WORKS
            </span>
          </span>
        </Heading>
        <p data-reveal className="mt-4">
          <MonoLabel className="normal-case text-muted">
            ( проекты, за которые нам не стыдно называть цифры )
          </MonoLabel>
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-5 px-5 pb-20 md:mt-16 md:grid-cols-2 md:gap-8 md:px-8 md:pb-28">
        {cases.map((item, i) => (
          <li key={item.slug} className={i === 0 ? "md:col-span-2" : ""}>
            <CaseCard item={item} index={i} featured={i === 0} />
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
