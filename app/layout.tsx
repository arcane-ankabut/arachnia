import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/motion/Cursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARACHNIA — AI-студия полного цикла",
  description:
    "Сайты, кастомные CRM, чат-боты, ИИ-видео, продакшн и маркетинг. Алматы · Казахстан · СНГ.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${anton.variable} ${inter.variable} ${jbMono.variable}`}
    >
      <body className="bg-void font-sans text-bone antialiased">
        <noscript>
          <style>{`[data-preloader]{display:none}`}</style>
        </noscript>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
