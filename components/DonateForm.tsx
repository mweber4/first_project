"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { Dict } from "@/lib/i18n";

const PRESETS = { USD: [36, 72, 180, 360, 1000], ILS: [100, 180, 360, 1000, 3600] };
const SYMBOL = { USD: "$", ILS: "₪" };
type Currency = keyof typeof PRESETS;

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 focus:border-gold focus:outline-none";
const pill = (on: boolean) =>
  `rounded-lg border-2 px-4 py-3 text-center font-semibold transition-colors ${
    on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"
  }`;

export function DonateForm({ t, donateUrl }: { t: Dict; donateUrl: string }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [preset, setPreset] = useState<number | null>(180);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState<"" | "invalid" | "offline">("");

  const amount = custom ? Number(custom) : (preset ?? 0);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || amount <= 0) return setMessage("invalid");
    if (!donateUrl) return setMessage("offline");
    // Hand the donor over to the payment processor with their choices pre-filled.
    const data = new FormData(e.currentTarget);
    const url = new URL(donateUrl);
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("currency", currency);
    url.searchParams.set("frequency", frequency);
    for (const key of ["name", "email", "phone", "dedication"]) {
      const v = String(data.get(key) ?? "").trim();
      if (v) url.searchParams.set(key, v);
    }
    window.location.assign(url.toString());
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-5 shadow-sm md:p-7">
      <fieldset>
        <legend className="mb-2 font-semibold">{t.frequency}</legend>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" aria-pressed={frequency === "once"} onClick={() => setFrequency("once")} className={pill(frequency === "once")}>
            {t.oneTime}
          </button>
          <button type="button" aria-pressed={frequency === "monthly"} onClick={() => setFrequency("monthly")} className={pill(frequency === "monthly")}>
            {t.monthly}
          </button>
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <legend className="float-start font-semibold">{t.amount}</legend>
          <div className="flex gap-1 text-sm" role="group" aria-label={t.currency}>
            {(Object.keys(PRESETS) as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={currency === c}
                onClick={() => {
                  setCurrency(c);
                  setPreset(PRESETS[c][2]);
                  setCustom("");
                }}
                className={`rounded-full px-3 py-1 ${currency === c ? "bg-sand font-bold" : "text-muted hover:bg-sand/60"}`}
              >
                {SYMBOL[c]} {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid clear-both grid-cols-3 gap-3 sm:grid-cols-5">
          {PRESETS[currency].map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={!custom && preset === a}
              onClick={() => {
                setPreset(a);
                setCustom("");
                setMessage("");
              }}
              className={pill(!custom && preset === a)}
            >
              <span dir="ltr">
                {SYMBOL[currency]}
                {a.toLocaleString("en-US")}
              </span>
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-sm text-muted">{t.otherAmount}</span>
          <span className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {SYMBOL[currency]}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min="1"
              dir="ltr"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setMessage("");
              }}
              className={`${input} pl-8`}
            />
          </span>
        </label>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">{t.fullName}</span>
          <input name="name" autoComplete="name" required className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t.email}</span>
          <input name="email" type="email" autoComplete="email" dir="ltr" className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t.phone}</span>
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" className={input} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">{t.dedication}</span>
          <input name="dedication" placeholder={t.dedicationPlaceholder} className={input} />
        </label>
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold-soft px-6 py-3.5 text-lg font-bold text-night transition-colors hover:bg-ink hover:text-white"
      >
        <Heart className="h-5 w-5" aria-hidden="true" />
        {t.continueToPayment}
        {amount > 0 && (
          <span dir="ltr">
            · {SYMBOL[currency]}
            {amount.toLocaleString("en-US")}
          </span>
        )}
      </button>

      <p role="alert" className={`mt-4 rounded-lg p-3 text-sm ${message ? "bg-sand" : "hidden"}`}>
        {message === "invalid" ? t.invalidAmount : t.donateNotConnected}
      </p>
    </form>
  );
}
