"use client";

import { useState } from "react";
import { Check, PhoneCall } from "lucide-react";
import type { Dict } from "@/lib/i18n";

/*
 * Preview only: this form looks and behaves like the sign-up for scheduled
 * phone shiurim, but nothing is saved or sent and no call is placed.
 * The real service (database, phone provider, scheduler) is not built yet.
 */

type Option = { id: string; label: string };

const COUNTRIES = [
  { id: "US", code: "+1", key: "callsCountryUS" },
  { id: "IL", code: "+972", key: "callsCountryIL" },
  { id: "UK", code: "+44", key: "callsCountryUK" },
  { id: "EU", code: "+", key: "callsCountryEU" },
] as const;
const LENGTHS = [15, 30, 45, 0];

const input =
  "w-full rounded-lg border border-line bg-card px-3 py-2.5 focus:border-gold focus:outline-none";
const chip = (on: boolean) =>
  `rounded-lg border-2 px-3 py-2.5 text-center font-semibold transition-colors ${
    on ? "border-gold bg-gold text-paper" : "border-line bg-card hover:border-gold"
  }`;

export function CallScheduler({
  t,
  speakers,
  topics,
  preview,
}: {
  t: Dict;
  speakers: Option[];
  topics: Option[];
  preview: boolean;
}) {
  const [follow, setFollow] = useState("all");
  const [time, setTime] = useState("08:15");
  const [days, setDays] = useState([true, true, true, true, true, false]);
  const [length, setLength] = useState(30);
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]["id"]>("US");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const code = COUNTRIES.find((c) => c.id === country)!.code;
  const followLabel =
    follow === "all"
      ? t.callsAnySpeech
      : [...speakers, ...topics].find((o) => `s:${o.id}` === follow || `t:${o.id}` === follow)?.label;
  const dayList = t.callsDayNames.filter((_, i) => days[i]).join(" · ");
  const lengthLabel = (m: number) => (m ? `${m} ${t.minutes}` : t.callsLengthFull);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 7) return setError(t.callsErrPhone);
    if (!days.some(Boolean)) return setError(t.callsErrDays);
    if (!consent) return setError(t.callsErrConsent);
    setError("");
    setDone(true);
  };

  if (done) {
    const rows = [
      [t.callsListening, followLabel],
      [t.callsTime, <span key="t" dir="ltr">{time}</span>],
      [t.callsDays, dayList],
      [t.callsLength, lengthLabel(length)],
      [t.callsPhone, <span key="p" dir="ltr">{`${code} ${phone}`}</span>],
    ] as const;
    return (
      <div role="status" className="rounded-lg border border-line border-t-4 border-t-gold bg-card p-5 md:p-7">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-tekhelet text-ink">
          <Check className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-none">{t.callsDoneTitle}</h2>
        <p className="mt-3 text-pretty leading-relaxed text-ink-soft">{t.callsDoneLead}</p>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-6 py-3">
              <dt className="shrink-0 text-sm text-muted">{label}</dt>
              <dd className="text-end font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        {preview && <p className="mt-4 text-sm text-pop">{t.callsPreviewNote}</p>}
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-full border border-ink/30 px-5 py-2.5 font-semibold transition-colors hover:border-gold hover:text-gold"
        >
          {t.callsEdit}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-lg border border-line border-t-4 border-t-gold bg-card p-5 md:p-7">
      <h2 className="font-display text-5xl font-bold uppercase leading-none">{t.callsFormTitle}</h2>

      <label className="mt-6 block">
        <span className="mb-2 block font-semibold">{t.callsFollow}</span>
        <select value={follow} onChange={(e) => setFollow(e.target.value)} className={`${input} bg-sand`}>
          <option value="all">{t.callsAnySpeech}</option>
          <optgroup label={t.navLecturers}>
            {speakers.map((s) => (
              <option key={s.id} value={`s:${s.id}`}>
                {s.label}
              </option>
            ))}
          </optgroup>
          <optgroup label={t.topic}>
            {topics.map((tp) => (
              <option key={tp.id} value={`t:${tp.id}`}>
                {tp.label}
              </option>
            ))}
          </optgroup>
        </select>
      </label>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-semibold">{t.callsTime}</span>
          <input
            type="time"
            dir="ltr"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`${input} bg-sand text-lg font-semibold`}
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-semibold">{t.callsLength}</span>
          <select value={length} onChange={(e) => setLength(Number(e.target.value))} className={`${input} bg-sand`}>
            {LENGTHS.map((m) => (
              <option key={m} value={m}>
                {lengthLabel(m)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 font-semibold">{t.callsDays}</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {t.callsDayNames.map((d, i) => (
            <button
              key={d}
              type="button"
              aria-pressed={days[i]}
              onClick={() => setDays((v) => v.map((x, j) => (j === i ? !x : x)))}
              className={chip(days[i])}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">{t.callsNoShabbos}</p>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-[2fr_3fr]">
        <label className="block">
          <span className="mb-2 block font-semibold">{t.callsCountry}</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as typeof country)}
            className={`${input} bg-sand`}
          >
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {t[c.key]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block font-semibold">{t.callsPhone}</span>
          <span dir="ltr" className="flex items-center gap-2">
            <span className="shrink-0 font-semibold text-muted">{code}</span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              aria-label={t.callsPhone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${input} bg-sand`}
            />
          </span>
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-gold)]"
        />
        <span className="text-sm leading-relaxed text-ink-soft">{t.callsConsent}</span>
      </label>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-tekhelet px-3 py-2 text-sm font-semibold">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-lg font-bold text-paper transition-colors hover:bg-tekhelet hover:text-ink"
      >
        <PhoneCall className="h-5 w-5" aria-hidden="true" />
        {t.callsSubmit}
      </button>
    </form>
  );
}
