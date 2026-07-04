import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CASES_DIR = path.join(process.cwd(), "content", "cases");

export type CaseMeta = {
  slug: string;
  title: string;
  /** anton — латиница display-шрифтом; sans — кириллица (у Anton нет кириллицы) */
  display: "anton" | "sans";
  tags: string;
  services: string;
  order: number;
  /** Якорный кейс — развёрнутая страница с цифрами */
  anchor: boolean;
};

export function getCaseSlugs(): string[] {
  return fs
    .readdirSync(CASES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllCases(): CaseMeta[] {
  return getCaseSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(CASES_DIR, `${slug}.mdx`), "utf8");
      const { data } = matter(raw);
      return { slug, display: "anton", anchor: false, ...data } as CaseMeta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getCase(
  slug: string,
): { meta: CaseMeta; content: string } | null {
  const file = path.join(CASES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    meta: { slug, display: "anton", anchor: false, ...data } as CaseMeta,
    content,
  };
}
