import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CursorWeb } from "@/components/motion/CursorWeb";
import { MobileFX } from "@/components/motion/MobileFX";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { getAllCases, getCase, getCaseSlugs } from "@/lib/cases";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return {
    title: `${item.meta.title} — кейс ARACHNIA`,
    description: item.meta.services,
  };
}

const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-14 font-mono text-xs uppercase tracking-[0.14em] text-muted"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-bone/90" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-4 max-w-[62ch] space-y-2 text-lg leading-relaxed" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="border-l border-hairline pl-4" {...props} />
  ),
};

export default async function CasePage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  const all = getAllCases();
  const index = all.findIndex((c) => c.slug === slug);
  const next = all[(index + 1) % all.length];
  const displayClass =
    item.meta.display === "sans"
      ? "font-sans font-extrabold tracking-tight"
      : "font-display tracking-[-0.01em]";

  return (
    <main className="px-5 pb-24 pt-5 md:px-8 md:pt-8">
      <CursorWeb />
      <MobileFX />
      <nav className="flex items-center justify-between">
        <Link href="/" className="transition-colors hover:text-accent">
          <MonoLabel>ARACHNIA</MonoLabel>
        </Link>
        <Link href="/cases" className="transition-colors hover:text-accent">
          <MonoLabel className="text-muted">( ← ALL CASES )</MonoLabel>
        </Link>
      </nav>

      <header className="mt-20 md:mt-28">
        <div className="flex items-baseline gap-4">
          <MonoLabel className="text-muted">[ {String(index + 1).padStart(2, "0")} ]</MonoLabel>
          <MonoLabel className="normal-case text-muted">( {item.meta.tags} )</MonoLabel>
        </div>
        <h1
          className={`mt-4 text-[clamp(48px,11vw,180px)] uppercase leading-[0.9] ${displayClass}`}
        >
          {item.meta.title}
        </h1>
        <p className="mt-4">
          <MonoLabel className="normal-case text-muted">{item.meta.services}</MonoLabel>
        </p>
      </header>

      <article className="mt-10 border-t border-hairline md:mt-14">
        <MDXRemote source={item.content} components={mdxComponents} />
      </article>

      <footer className="mt-20 border-t border-hairline pt-8 md:mt-28">
        <Link href={`/cases/${next.slug}`} className="group block">
          <MonoLabel className="text-muted">NEXT CASE</MonoLabel>
          <span
            className={`mt-2 block text-[clamp(32px,5vw,72px)] uppercase leading-none transition-colors duration-300 md:group-hover:text-accent ${
              next.display === "sans"
                ? "font-sans font-extrabold tracking-tight"
                : "font-display tracking-[-0.01em]"
            }`}
          >
            {next.title} ↗
          </span>
        </Link>
      </footer>
    </main>
  );
}
