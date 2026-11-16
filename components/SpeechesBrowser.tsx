"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SpeechCard } from "./cards";
import type { Speech, Topic } from "@/lib/data";
import { localeNames, locales, type Dict, type Lang } from "@/lib/i18n";
import { normalize } from "@/lib/search";

const field =
  "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-[15px] focus:border-gold focus:outline-none";

export function SpeechesBrowser({
  speeches,
  lecturers,
  topics,
  lang,
  t,
}: {
  speeches: Speech[];
  lecturers: { slug: string; name: string }[];
  topics: Topic[];
  lang: Lang;
  t: Dict;
}) {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [lecturer, setLecturer] = useState(params.get("lecturer") ?? "");
  const [topic, setTopic] = useState(params.get("topic") ?? "");
  const [language, setLanguage] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("newest");

  const results = useMemo(() => {
    const tokens = normalize(q).split(" ").filter(Boolean);
    const list = speeches.filter(
      (s) =>
        (!lecturer || s.lecturerSlug === lecturer) &&
        (!topic || s.topics.some((tp) => tp.id === topic)) &&
        (!language || s.language === language) &&
        (!type || s.type === type) &&
        tokens.every((tok) => s.search.includes(tok)),
    );
    if (sort === "oldest") return [...list].reverse();
    if (sort === "title")
      return [...list].sort((a, b) => a.title.localeCompare(b.title, lang === "en" ? "en" : "he"));
    return list;
  }, [speeches, q, lecturer, topic, language, type, sort, lang]);

  const filtered = q || lecturer || topic || language || type;
  const clear = () => {
    setQ("");
    setLecturer("");
    setTopic("");
    setLanguage("");
    setType("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-md border border-line bg-sand/60 p-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <label className="relative lg:col-span-2">
            <span className="sr-only">{t.filterSpeeches}</span>
            <Search
              className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.filterSpeeches}
              className={`${field} ps-9`}
            />
          </label>
          <select aria-label={t.lecturer} value={lecturer} onChange={(e) => setLecturer(e.target.value)} className={field}>
            <option value="">{t.allLecturers}</option>
            {lecturers.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
          </select>
          <select aria-label={t.speechLanguage} value={language} onChange={(e) => setLanguage(e.target.value)} className={field}>
            <option value="">{t.allLanguages}</option>
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeNames[l]}
              </option>
            ))}
          </select>
          <select aria-label={t.mediaType} value={type} onChange={(e) => setType(e.target.value)} className={field}>
            <option value="">{t.allTypes}</option>
            <option value="audio">{t.audio}</option>
            <option value="video">{t.video}</option>
          </select>
          <select aria-label={t.sort} value={sort} onChange={(e) => setSort(e.target.value)} className={field}>
            <option value="newest">{t.sortNewest}</option>
            <option value="oldest">{t.sortOldest}</option>
            <option value="title">{t.sortTitle}</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.topic}>
          {[{ id: "", label: t.allTopics, count: speeches.length }, ...topics].map((tp) => (
            <button
              key={tp.id}
              type="button"
              onClick={() => setTopic(tp.id)}
              aria-pressed={topic === tp.id}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                topic === tp.id
                  ? "border-ink bg-ink font-semibold text-paper"
                  : "border-line bg-card hover:border-ink"
              }`}
            >
              {tp.label} <span className="opacity-60">({tp.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-muted" aria-live="polite">
          <strong className="text-ink">{results.length}</strong> {t.speechesCount}
        </p>
        {filtered && (
          <button type="button" onClick={clear} className="text-sm font-semibold text-gold hover:underline">
            {t.clearFilters}
          </button>
        )}
      </div>

      {results.length ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {results.map((s) => (
            <SpeechCard key={s.slug} speech={s} lang={lang} t={t} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-md border border-dashed border-line py-14 text-center text-lg text-muted">
          {t.noMatches}
        </p>
      )}
    </div>
  );
}
