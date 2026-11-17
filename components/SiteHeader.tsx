"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Languages, Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { localeNames, locales, type Dict, type Lang } from "@/lib/i18n";

export function SiteHeader({ lang, t }: { lang: Lang; t: Dict }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
    setOpen(false);
    router.push(`/${lang}/search?q=${encodeURIComponent(q.trim())}`);
  };

  const langSwitch = (
    <div className="flex items-center gap-1 text-sm" role="group" aria-label={t.language}>
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={`rounded-lg px-2.5 py-1 transition-colors ${
            l === lang
              ? "bg-gold-soft font-semibold text-gold"
              : "text-muted hover:bg-sand hover:text-ink"
          }`}
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );

  const searchForm = (
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
        className="w-full rounded-lg border border-line bg-card py-2 ps-9 pe-4 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 bg-paper/90 pt-[env(safe-area-inset-top)] text-ink backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 ps-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] sm:gap-4">
        <Link href={`/${lang}`} className="flex shrink-0 items-center gap-2.5">
          <Logo />
          <span className="font-serif text-xl font-bold leading-none">{t.siteName}</span>
        </Link>

        <nav className="ms-4 hidden items-center gap-1 xl:flex" aria-label={t.menu}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={`/${lang}${n.href}`}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`px-2 py-1 text-sm font-medium whitespace-nowrap uppercase tracking-[0.12em] transition-colors rtl:tracking-normal ${
                isActive(n.href) ? "mark" : "text-ink/75 hover:text-gold"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto hidden min-w-0 max-w-48 flex-1 xl:block">{searchForm}</div>
        <div className="hidden xl:block">{langSwitch}</div>

        <Link
          href={`/${lang}/donate`}
          className="ms-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-sm font-bold sm:px-5 text-paper transition-colors hover:bg-tekhelet hover:text-ink xl:ms-0"
        >
          <Heart className="h-4 w-4" aria-hidden="true" />
          {t.donateCta}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.menu}
          className="-me-2 flex h-11 w-11 items-center justify-center rounded-lg hover:bg-sand xl:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-2 pb-2 ps-[max(1rem,env(safe-area-inset-left))] pe-[max(1rem,env(safe-area-inset-right))] xl:hidden">
        <Languages className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
        <div
          role="group"
          aria-label={t.language}
          className="grid flex-1 grid-cols-3 gap-1 rounded-full border border-gold/50 bg-card p-1"
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}${rest}`}
              hrefLang={l}
              lang={l}
              aria-current={l === lang ? "true" : undefined}
              className={`flex h-10 items-center justify-center rounded-full text-base font-semibold transition-colors ${
                l === lang ? "bg-gold text-paper shadow-sm" : "text-ink hover:bg-sand active:bg-sand"
              }`}
            >
              {localeNames[l]}
            </Link>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="brand-stripe" />

      {open && (
        <div id="mobile-menu" className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-line bg-paper px-4 pb-5 pt-4 xl:hidden">
          {searchForm}
          <nav className="mt-3 flex flex-col" aria-label={t.menu}>
            {nav.map((n) => (
              <Link
                key={n.href}
                href={`/${lang}${n.href}`}
                onClick={() => setOpen(false)}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-lg px-2 py-3 text-lg ${
                  isActive(n.href) ? "mark font-semibold" : "text-ink/85"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
