import { MonoLabel } from "@/components/ui/MonoLabel";
import { SITE } from "@/lib/site";

/** Футер (COPY.md §8): гигантский логотип, контакты, метки, соцсети. */
export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="overflow-hidden px-1 pt-14 md:pt-20">
        <div className="text-center font-display text-[18.5vw] uppercase leading-[0.8] tracking-[-0.01em]">
          ARACHNIA
        </div>
      </div>

      <div className="px-5 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <a
              href={`mailto:${SITE.email}`}
              className="block text-[clamp(24px,4vw,56px)] font-semibold lowercase leading-none tracking-tight transition-colors hover:text-accent"
            >
              {SITE.email}
            </a>
            <p className="mt-3">
              <MonoLabel className="text-muted">{SITE.phone}</MonoLabel>
            </p>
          </div>

          <div className="flex gap-6">
            {(
              [
                ["INSTAGRAM", SITE.instagram],
                ["THREADS", SITE.threads],
                ["TELEGRAM", SITE.telegram],
              ] as const
            ).map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                <MonoLabel>{label}</MonoLabel>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 md:mt-16 md:flex-row md:justify-between">
          <MonoLabel className="text-muted">AI-DRIVEN STUDIO</MonoLabel>
          <MonoLabel className="text-muted">
            WEB · CRM · BOTS · VIDEO · MARKETING
          </MonoLabel>
          <MonoLabel className="text-muted">EST. 2026 · ALMATY</MonoLabel>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-hairline px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
        <MonoLabel className="text-muted">
          © 2026 ARACHNIA. ALL RIGHTS RESERVED.
        </MonoLabel>
        <MonoLabel className="normal-case text-muted">( сделано без шаблонов )</MonoLabel>
      </div>
    </footer>
  );
}
