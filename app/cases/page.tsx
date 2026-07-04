import type { Metadata } from "next";
import Link from "next/link";
import { CursorWeb } from "@/components/motion/CursorWeb";
import { MobileFX } from "@/components/motion/MobileFX";
import { SelectedWorks } from "@/components/SelectedWorks";
import { MonoLabel } from "@/components/ui/MonoLabel";

export const metadata: Metadata = {
  title: "Кейсы — ARACHNIA",
  description:
    "Проекты студии: Indomie, ЖК Совмин, ТАСС, Tassay, Pika Pika. Сайты, CRM, боты, ИИ-видео, продакшн, маркетинг.",
};

export default function CasesPage() {
  return (
    <main className="pb-24">
      <CursorWeb />
      <MobileFX />
      <nav className="flex items-center justify-between px-5 pt-5 md:px-8 md:pt-8">
        <Link href="/" className="transition-colors hover:text-accent">
          <MonoLabel>ARACHNIA</MonoLabel>
        </Link>
        <Link href="/" className="transition-colors hover:text-accent">
          <MonoLabel className="text-muted">( ← HOME )</MonoLabel>
        </Link>
      </nav>
      <SelectedWorks heading="h1" />
    </main>
  );
}
