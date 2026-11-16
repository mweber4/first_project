"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, Search, X } from "lucide-react";
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
          className={`rounded-full px-2.5 py-1 transition-colors ${
            l === lang
              ? "bg-gold-soft font-semibold text-night"
              : "text-white/75 hover:bg-white/10 hover:text-white"
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
        className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
        aria-hidden="true"
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchButton}
        className="w-full rounded-full border border-white/15 bg-white/10 py-2 ps-9 pe-4 text-sm text-white placeholder:text-white/55 focus:border-gold-soft focus:bg-white/15 focus:outline-none"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 bg-ink text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href={`/${lang}`} className="flex shrink-0 items-center gap-2.5">
          <Logo />
          <span className="font-serif text-xl font-bold leading-none">{t.siteName}</span>
        </Link>

        <nav className="ms-4 hidden items-center gap-1 lg:flex" aria-label={t.menu}>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={`/${lang}${n.href}`}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-[15px] transition-colors ${
                isActive(n.href)
                  ? "font-semibold text-gold-soft"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto hidden w-56 lg:block xl:w-64">{searchForm}</div>
        <div className="hidden lg:block">{langSwitch}</div>

        <Link
          href={`/${lang}/donate`}
          className="ms-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-soft px-4 py-2 text-sm font-bold text-night transition-colors hover:bg-white lg:ms-0"
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
          className="rounded-md p-2 hover:bg-white/10 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-ink px-4 pb-5 pt-4 lg:hidden">
          {searchForm}
          <nav className="mt-3 flex flex-col" aria-label={t.menu}>
            {nav.map((n) => (
              <Link
                key={n.href}
                href={`/${lang}${n.href}`}
                onClick={() => setOpen(false)}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-md px-2 py-3 text-lg ${
                  isActive(n.href) ? "font-semibold text-gold-soft" : "text-white/90"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-white/10 pt-4">{langSwitch}</div>
        </div>
      )}
    </header>
  );
}
