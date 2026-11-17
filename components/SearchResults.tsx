"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Clapperboard, Megaphone, Mic, Search, Tag, User } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { search, type SearchDoc, type SearchKind } from "@/lib/search";

const ICONS = { speech: Mic, lecturer: User, video: Clapperboard, campaign: Megaphone, topic: Tag };

export function SearchResults({
  docs,
  t,
  topics,
}: {
  docs: SearchDoc[];
  t: Dict;
  topics: { href: string; label: string }[];
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [kind, setKind] = useState<SearchKind | "">("");

  const kindLabel: Record<SearchKind, string> = {
    speech: t.kindSpeech,
    lecturer: t.kindLecturer,
    video: t.kindVideo,
    campaign: t.kindCampaign,
    topic: t.kindTopic,
  };

  const all = useMemo(() => search(docs, q), [docs, q]);
  const shown = kind ? all.filter((d) => d.kind === kind) : all;
  const kinds = (Object.keys(kindLabel) as SearchKind[]).filter((k) => all.some((d) => d.kind === k));

  const onChange = (value: string) => {
    setQ(value);
    setKind("");
    // keep the address bar shareable without triggering a navigation
    const url = value.trim() ? `${pathname}?q=${encodeURIComponent(value.trim())}` : pathname;
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <Search
          className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchTitle}
          className="w-full rounded-lg border-2 border-line bg-card py-3.5 ps-12 pe-5 text-lg focus:border-gold focus:outline-none"
        />
      </form>

      {!q.trim() ? (
        <div className="mt-8">
          <p className="text-muted">{t.searchHint}</p>
          <h2 className="mt-8 font-serif text-xl font-bold">{t.browseByTopic}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((tp) => (
              <Link
                key={tp.href}
                href={tp.href}
                className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm hover:border-gold"
              >
                {tp.label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <p className="me-2 text-muted" aria-live="polite">
              <strong className="text-ink">{all.length}</strong> {t.resultsCount}
            </p>
            {kinds.length > 1 &&
              (["", ...kinds] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  aria-pressed={kind === k}
                  className={`rounded-lg border px-3 py-1 text-sm ${
                    kind === k
                      ? "border-gold bg-gold font-semibold text-paper"
                      : "border-line bg-card hover:border-gold"
                  }`}
                >
                  {k ? kindLabel[k] : t.all}{" "}
                  <span className="opacity-60">
                    ({k ? all.filter((d) => d.kind === k).length : all.length})
                  </span>
                </button>
              ))}
          </div>

          {shown.length ? (
            <ul className="mt-5 divide-y divide-line overflow-hidden rounded-lg border border-line bg-card">
              {shown.map((d) => {
                const Icon = ICONS[d.kind];
                return (
                  <li key={d.href}>
                    <Link href={d.href} className="flex items-center gap-4 p-4 hover:bg-sand/60">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sand">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-lg font-bold leading-snug" dir="auto">
                          {d.title}
                        </span>
                        <span className="block text-sm text-muted">{d.subtitle}</span>
                      </span>
                      <span className="shrink-0 rounded-lg bg-sand px-2 py-0.5 text-xs font-medium">
                        {kindLabel[d.kind]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-10 rounded-lg border border-dashed border-line py-14 text-center">
              <p className="text-lg">
                {t.searchEmpty} “{q}”
              </p>
              <p className="mt-1 text-muted">{t.searchTryAgain}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
