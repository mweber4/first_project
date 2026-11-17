"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown, Heart, Languages, Search } from "lucide-react";
import { Logo } from "./Logo";
import { localeNames, locales, type Dict, type Lang } from "@/lib/i18n";

/** Two-letter labels for the compact language switch on narrow screens. */
const shortNames: Record<Lang, string> = { he: "עב", yi: "אי", en: "EN" };

export function SiteHeader({ lang, t }: { lang: Lang; t: Dict }) {
  const pathname = usePathname();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [q, setQ] = useState("");

  const rest = pathname.replace(/^\/[^/]+/, "");
  const nav = [
    { href: "", label: t.navHome },
    { href: "/speeches", label: t.navSpeeches },
    { href: "/lecturers", label: t.navLecturers },
    { href: "/resources", label: t.navResources },
    { href: "/techniques", label: t.navTechniques },
    { href: "/calls", label: t.navCalls },
  ];
  const isActive = (href: string) =>
    href === "" ? rest === "" : rest.startsWith(href);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/${lang}/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 pt-[env(safe-area-inset-top)] text-ink backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-2 ps-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] sm:gap-4">
        <Link href={`/${lang}`} className="flex min-w-0 shrink items-center gap-2.5">
          <Logo className="h-9 w-9 shrink-0" />
          <span className="truncate font-serif text-2xl font-medium leading-none sm:text-3xl">{t.siteName}</span>
        </Link>

        <div className="ms-auto hidden min-w-0 max-w-64 flex-1 lg:block">
          <form onSubmit={submit} role="search" className="relative w-full">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchButton}
              className="w-full rounded-lg border border-line bg-card py-2 ps-9 pe-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
            />
          </form>
        </div>

        {/* Desktop: the three languages inline. */}
        <div className="hidden items-center gap-1 text-sm 2xl:flex" role="group" aria-label={t.language}>
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}${rest}`}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? "true" : undefined}
              className={`px-2.5 py-1 transition-colors ${
                l === lang ? "font-semibold text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {localeNames[l]}
            </Link>
          ))}
        </div>

        {/* Phones and tablets: one compact button in the header row. */}
        <div className="relative ms-auto shrink-0 2xl:hidden">
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            aria-expanded={langOpen}
            aria-controls="lang-menu"
            aria-label={`${t.language}: ${localeNames[lang]}`}
            className="flex h-11 items-center gap-1.5 rounded-sm border border-line px-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            <Languages className="h-4 w-4 text-tekhelet" aria-hidden="true" />
            <span className="sm:hidden">{shortNames[lang]}</span>
            <span className="hidden sm:inline">{localeNames[lang]}</span>
            <ChevronDown
              className={`hidden h-4 w-4 text-muted transition-transform sm:block ${langOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {langOpen && (
            <ul
              id="lang-menu"
              className="absolute end-0 top-full z-50 mt-2 w-44 rounded-sm border border-line bg-card py-1 shadow-xl shadow-night/15"
            >
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={`/${l}${rest}`}
                    hrefLang={l}
                    lang={l}
                    onClick={() => setLangOpen(false)}
                    aria-current={l === lang ? "true" : undefined}
                    className={`flex h-12 items-center justify-between gap-3 px-4 text-base ${
                      l === lang ? "font-semibold text-tekhelet" : "text-ink hover:bg-sand"
                    }`}
                  >
                    {localeNames[l]}
                    {l === lang && <Check className="h-4 w-4" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          href={`/${lang}/donate`}
          className="btn btn-primary h-11 shrink-0 !px-3.5 !py-0 !text-sm sm:!px-4 lg:h-auto lg:!py-2"
        >
          <Heart className="hidden h-4 w-4 sm:block" aria-hidden="true" />
          {t.donateCta}
        </Link>
      </div>
        <nav className="mx-auto hidden max-w-7xl flex-wrap items-center gap-x-6 gap-y-1 px-4 pb-4 lg:flex" aria-label={t.menu}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={`/${lang}${n.href}`}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`py-1 text-sm font-medium whitespace-nowrap tracking-normal transition-colors rtl:tracking-normal ${
                isActive(n.href) ? "mark" : "text-ink/75 hover:text-tekhelet"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
    </header>
  );
}
