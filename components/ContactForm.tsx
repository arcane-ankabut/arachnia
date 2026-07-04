"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SERVICE_OPTIONS } from "@/lib/site";

type Status = "idle" | "sending" | "ok" | "error";

const fieldClass =
  "w-full border-b border-hairline bg-transparent py-3 text-base text-bone transition-colors placeholder:text-muted/60 focus:border-accent focus:outline-none";

/**
 * Форма заявки (CLAUDE.md): имя, телефон, услуга-селект, комментарий
 * → POST /api/lead → Telegram-бот.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("ok");
      navigator.vibrate?.(10); // haptics, DESIGN.md §4.5 (iOS тихо игнорирует)
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2 md:gap-x-10">
      {/* honeypot для ботов */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <label className="block">
        <MonoLabel className="text-muted">( имя )</MonoLabel>
        <input name="name" required maxLength={200} className={`mt-2 ${fieldClass}`} />
      </label>

      <label className="block">
        <MonoLabel className="text-muted">( телефон )</MonoLabel>
        <input
          name="phone"
          type="tel"
          required
          maxLength={50}
          className={`mt-2 ${fieldClass}`}
        />
      </label>

      <label className="block">
        <MonoLabel className="text-muted">( услуга )</MonoLabel>
        <select name="service" defaultValue="" className={`mt-2 appearance-none rounded-none ${fieldClass}`}>
          <option value="" disabled className="bg-surface text-muted">
            —
          </option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-surface text-bone">
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <MonoLabel className="text-muted">( комментарий )</MonoLabel>
        <textarea name="comment" rows={1} maxLength={500} className={`mt-2 resize-none ${fieldClass}`} />
      </label>

      <div className="md:col-span-2">
        <Button type="submit" disabled={status === "sending"}>
          SEND
          <span className="normal-case text-muted">( отправить )</span>
          <span aria-hidden>↗</span>
        </Button>

        <p role="status" aria-live="polite" className="mt-4 min-h-5">
          {status === "ok" && (
            <MonoLabel className="normal-case text-accent">
              ( заявка отправлена — ответим в течение рабочего дня )
            </MonoLabel>
          )}
          {status === "error" && (
            <MonoLabel className="normal-case text-muted">
              ( не получилось отправить — напишите нам в telegram или whatsapp )
            </MonoLabel>
          )}
        </p>
      </div>
    </form>
  );
}
