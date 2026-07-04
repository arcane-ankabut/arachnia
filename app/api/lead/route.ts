import { NextResponse } from "next/server";

type Lead = {
  name?: string;
  phone?: string;
  service?: string;
  comment?: string;
  company?: string; // honeypot
};

const MAX = 500;

export async function POST(req: Request) {
  let lead: Lead;
  try {
    lead = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // honeypot: боты заполняют скрытое поле — отвечаем «ок», ничего не шлём
  if (lead.company) return NextResponse.json({ ok: true });

  const name = lead.name?.trim().slice(0, MAX);
  const phone = lead.phone?.trim().slice(0, MAX);
  if (!name || !phone) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("lead: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы");
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const text = [
    "🕸 Новая заявка — arachnia",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Услуга: ${lead.service?.trim().slice(0, MAX) || "—"}`,
    `Комментарий: ${lead.comment?.trim().slice(0, MAX) || "—"}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    console.error("lead: telegram error", res.status, await res.text());
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
