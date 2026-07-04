import { CompetenceCloud } from "@/components/CompetenceCloud";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { CursorWeb } from "@/components/motion/CursorWeb";
import { HeroGyro } from "@/components/motion/HeroGyro";
import { IntroSequence } from "@/components/motion/IntroSequence";
import { MobileFX } from "@/components/motion/MobileFX";
import { Reveal } from "@/components/motion/Reveal";
import { SelectedWorks } from "@/components/SelectedWorks";
import { ButtonLink } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/site";

/* COPY.md §3 — marquee услуг */
const MARQUEE_LANE_1 = [
  { en: "WEBSITES", ru: "сайты" },
  { en: "CUSTOM CRM", ru: "crm под бизнес" },
  { en: "AI BOTS", ru: "боты" },
  { en: "AI VIDEO", ru: "ии-видео" },
];

const MARQUEE_LANE_2 = [
  { en: "PRODUCTION", ru: "продакшн" },
  { en: "MARKETING", ru: "перформанс" },
  { en: "CONSULTING", ru: "консалтинг" },
  { en: "GEN-AI VISUAL", ru: "генеративный визуал" },
];

/* COPY.md §5 — услуги + строки выгоды */
const SERVICES = [
  {
    num: "01",
    en: "WEB",
    ru: "сайты и e-commerce",
    benefit: "лендинги и порталы, которые конвертируют, а не украшают",
  },
  {
    num: "02",
    en: "CRM",
    ru: "системы под процессы бизнеса",
    benefit: "не коробка — система под ваши реальные процессы",
  },
  {
    num: "03",
    en: "BOTS",
    ru: "чат-боты и автоматизация",
    benefit: "бот отвечает за 3 секунды и не уходит в отпуск",
  },
  {
    num: "04",
    en: "AI VIDEO",
    ru: "генеративное видео и моушн",
    benefit: "ролик уровня продакшена без сметы продакшена",
  },
  {
    num: "05",
    en: "PRODUCTION",
    ru: "съёмка и постпродакшн",
    benefit: "съёмка + генерация: гибридный пайплайн под задачу",
  },
  {
    num: "06",
    en: "MARKETING",
    ru: "стратегия · перформанс · дистрибуция · консалтинг",
    benefit: "от стратегии до полки: считаем деньги, не охваты",
  },
];

/* COPY.md §4 — стат-метки; [XX] заменить на реальное число проектов */
const STATS = ["INTL_BRANDS_SERVED", "6_SERVICE_LINES", "3_MARKETS", "[XX]_PROJECTS"];

export default function Home() {
  return (
    <IntroSequence>
      <CursorWeb />
      <MobileFX />
      <main>
        {/* Hero — вариант B из COPY.md §2 */}
        <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5">
          <div
            data-hero-fade
            data-gyro="label"
            className="absolute left-5 top-5 md:left-8 md:top-8"
          >
            <MonoLabel>ARACHNIA</MonoLabel>
          </div>
          <div
            data-hero-fade
            data-gyro="label"
            className="absolute right-5 top-5 text-right md:right-8 md:top-8"
          >
            <MonoLabel className="text-muted">WEB / CRM / BOTS / AI VIDEO</MonoLabel>
          </div>

          <h1
            data-gyro="title"
            data-skew
            className="text-center font-display text-[clamp(64px,16.5vw,290px)] uppercase leading-[0.88] tracking-[-0.01em]"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block">
                WE&nbsp;WEAVE
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block">
                DIGITAL
              </span>
            </span>
          </h1>

          <p
            data-hero-fade
            data-gyro="label"
            className="mt-6 max-w-[90vw] text-center md:mt-8"
          >
            <MonoLabel ru="сайты · crm · боты · ии-видео — сплетаем в одну систему" />
          </p>

          <HeroGyro />

          <div className="absolute inset-x-5 bottom-5 flex flex-col gap-1.5 md:inset-x-8 md:bottom-8 md:flex-row md:items-end md:justify-between">
            <div data-hero-fade data-gyro="label" className="flex items-center gap-2">
              <MonoLabel className="text-muted">( SCROLL TO EXPLORE )</MonoLabel>
              <span
                aria-hidden
                className="animate-bounce font-mono text-[11px] text-muted"
              >
                ↓
              </span>
            </div>
            <div
              data-hero-fade
              data-gyro="label"
              className="flex flex-col gap-1 md:items-end md:text-right"
            >
              <MonoLabel className="text-muted">KZ · CIS · WORLDWIDE</MonoLabel>
              <MonoLabel className="text-muted">
                TRUSTED BY INDOMIE · TASSAY · ТАСС
              </MonoLabel>
            </div>
          </div>
        </section>

        {/* Marquee услуг — две ленты в противоположных направлениях */}
        <Section flush className="space-y-5 py-10 md:space-y-7 md:py-14">
          <Marquee
            items={MARQUEE_LANE_1}
            className="text-[clamp(30px,4.5vw,64px)]"
            duration={38}
          />
          <Marquee
            items={MARQUEE_LANE_2}
            reverse
            className="text-[clamp(30px,4.5vw,64px)] text-muted"
            duration={46}
          />
        </Section>

        {/* WHO WE ARE — вариант B из COPY.md §4 */}
        <Section>
          <Reveal>
            <div data-reveal>
              <MonoLabel className="text-muted">WHO WE ARE</MonoLabel>
            </div>

            <h2
              data-skew
              className="mt-8 text-[clamp(24px,3vw,44px)] font-semibold uppercase leading-[1.15] tracking-tight md:mt-10"
            >
              <span className="block overflow-hidden">
                <span data-reveal-line className="block">
                  Классические агентства продают часы.
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-reveal-line className="block">
                  Мы продаём результат — потому что рутину делает ИИ,
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-reveal-line className="block">
                  а головой работают люди.
                </span>
              </span>
            </h2>

            <p data-reveal className="mt-6 md:mt-8">
              <MonoLabel className="normal-case text-muted">
                ( ai does the routine. humans do the thinking. )
              </MonoLabel>
            </p>

            <div
              data-reveal
              className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-2 md:mt-16 md:gap-x-6"
            >
              {STATS.map((stat, i) => (
                <span key={stat} className="flex items-baseline gap-x-4 md:gap-x-6">
                  <MonoLabel>{stat}</MonoLabel>
                  {i < STATS.length - 1 && (
                    <MonoLabel aria-hidden className="text-muted">
                      //
                    </MonoLabel>
                  )}
                </span>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* Услуги — 6 направлений, раскрытие по hover (COPY.md §5) */}
        <Section flush>
          <Reveal>
            <ul className="divide-y divide-hairline">
              {SERVICES.map((service) => (
                <li key={service.num} data-reveal-item className="group">
                  <div className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 px-5 py-7 md:grid-cols-[5rem_1fr] md:gap-x-6 md:px-8 md:py-9">
                    <MonoLabel className="text-muted">{service.num}</MonoLabel>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4">
                        <h3 className="font-display text-[clamp(34px,5vw,72px)] uppercase leading-none tracking-[-0.01em] transition-colors duration-300 md:group-hover:text-accent">
                          {service.en}
                        </h3>
                        <MonoLabel ru={service.ru} />
                      </div>
                      <div className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-400 ease-out md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100">
                        <p className="overflow-hidden text-base text-muted md:text-lg">
                          <span className="block pt-3 md:pt-4">{service.benefit}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>

        {/* SELECTED WORKS — COPY.md §6 */}
        <Section flush id="works">
          <SelectedWorks />
        </Section>

        {/* Облако меток компетенций — DESIGN.md §3 */}
        <Section flush>
          <CompetenceCloud />
        </Section>

        {/* CTA перед футером — COPY.md §7 */}
        <Section id="contact">
          <Reveal>
            <h2
              data-skew
              className="font-display text-[clamp(44px,9vw,150px)] uppercase leading-[0.9] tracking-[-0.01em]"
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-reveal-line className="block">
                  HAVE A PROJECT?
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-reveal-line className="block text-muted">
                  LET&rsquo;S TALK.
                </span>
              </span>
            </h2>

            <p data-reveal className="mt-4">
              <MonoLabel className="normal-case text-muted">
                ( ответим в течение рабочего дня )
              </MonoLabel>
            </p>

            <div data-reveal className="mt-8 flex flex-wrap gap-3 md:mt-10">
              <ButtonLink href={SITE.whatsapp} target="_blank" rel="noopener noreferrer">
                WHATSAPP <span aria-hidden>↗</span>
              </ButtonLink>
              <ButtonLink href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                TELEGRAM <span aria-hidden>↗</span>
              </ButtonLink>
              <ButtonLink href={`mailto:${SITE.email}`}>
                EMAIL <span aria-hidden>↗</span>
              </ButtonLink>
            </div>

            <div data-reveal className="mt-16 max-w-3xl md:mt-20">
              <ContactForm />
            </div>
          </Reveal>
        </Section>
      </main>

      <Footer />
    </IntroSequence>
  );
}
