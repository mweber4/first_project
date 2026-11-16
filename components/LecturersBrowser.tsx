"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { LecturerCard } from "./cards";
import type { Lecturer } from "@/lib/data";
import type { Dict, Lang } from "@/lib/i18n";
import { normalize } from "@/lib/search";

export function LecturersBrowser({ lecturers, lang, t }: { lecturers: Lecturer[]; lang: Lang; t: Dict }) {
  const [q, setQ] = useState("");
  const tokens = normalize(q).split(" ").filter(Boolean);
  const results = lecturers.filter((l) => tokens.every((tok) => l.search.includes(tok)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <label className="relative block max-w-md">
        <span className="sr-only">{t.filterPlaceholder}</span>
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.filterPlaceholder}
          className="w-full rounded-lg border border-line bg-white py-2.5 ps-9 pe-3 focus:border-gold focus:outline-none"
        />
      </label>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((l) => (
          <LecturerCard key={l.slug} lecturer={l} lang={lang} t={t} />
        ))}
      </div>
      {!results.length && (
        <p className="mt-10 text-center text-lg text-muted">
          {t.searchEmpty} “{q}”
        </p>
      )}
    </div>
  );
}
