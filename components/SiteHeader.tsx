"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Languages, Search } from "lucide-react";
import { Logo } from "./Logo";
import { localeNames, locales, type Dict, type Lang } from "@/lib/i18n";

function LangSwitch({
  lang,
  rest,
  label,
  className = "",
}: {
  lang: Lang;
  rest: string;
  label: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={`shrink-0 rounded-sm border border-ink/20 bg-card p-1 ${className}`}>
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={`flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 text-sm font-semibold transition-colors ${
            l === lang ? "bg-tekhelet text-snow" : "text-ink-soft hover:bg-sand hover:text-ink"
          }`}
        >
          {localeNames[l]}
        </Link>
      ))}
    </div>
  );
}

export function SiteHeader({ lang, t }: { lang: Lang; t: Dict }) {
  const pathname = usePathname();
  const router = useRouter();
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

        <LangSwitch lang={lang} rest={rest} label={t.language} className="ms-auto hidden sm:flex lg:ms-0" />

        <Link
          href={`/${lang}/donate`}
          className="btn btn-primary h-11 shrink-0 !px-3.5 !py-0 !text-sm sm:!px-4 lg:h-auto lg:!py-2"
        >
          <Heart className="hidden h-4 w-4 sm:block" aria-hidden="true" />
          {t.donateCta}
        </Link>
      </div>
      <div className="flex items-center gap-3 border-t border-line px-4 py-2 sm:hidden">
        <Languages className="h-5 w-5 shrink-0 text-tekhelet" aria-hidden="true" />
        <LangSwitch lang={lang} rest={rest} label={t.language} className="flex flex-1" />
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
