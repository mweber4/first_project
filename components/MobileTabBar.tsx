"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Ellipsis, Headphones, Heart, House, Lightbulb, PhoneCall, Search, Users, X } from "lucide-react";
import type { Dict, Lang } from "@/lib/i18n";

/** Bottom navigation for phones and tablets. It replaces the hamburger menu. */
export function MobileTabBar({ lang, t }: { lang: Lang; t: Dict }) {
  const rest = usePathname().replace(/^\/[^/]+/, "");
  const [more, setMore] = useState(false);

  const tabs = [
    { href: "", label: t.navHome, Icon: House },
    { href: "/speeches", label: t.navSpeeches, Icon: Headphones },
    { href: "/techniques", label: t.tabTechniques, Icon: Lightbulb },
    { href: "/calls", label: t.tabCalls, Icon: PhoneCall },
  ];
  const extra = [
    { href: "/lecturers", label: t.navLecturers, Icon: Users },
    { href: "/resources", label: t.navResources, Icon: BookOpen },
    { href: "/search", label: t.searchTitle, Icon: Search },
    { href: "/donate", label: t.navDonate, Icon: Heart },
  ];
  const isActive = (href: string) => (href === "" ? rest === "" : rest.startsWith(href));
  const moreActive = more || extra.some((x) => isActive(x.href));
  const tab = (active: boolean) =>
    `flex h-16 w-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
      active ? "text-gold" : "text-muted hover:text-ink"
    }`;

  return (
    <>
      {more && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <button
            type="button"
            aria-label={t.close}
            onClick={() => setMore(false)}
            className="absolute inset-0 h-full w-full bg-night/70"
          />
          <nav
            id="more-menu"
            aria-label={t.tabMore}
            className="absolute inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] border-t border-line bg-paper px-4 pb-2 pt-2"
          >
            <ul className="mx-auto max-w-2xl">
              {extra.map(({ href, label, Icon }) => (
                <li key={href} className="border-b border-line last:border-b-0">
                  <Link
                    href={`/${lang}${href}`}
                    onClick={() => setMore(false)}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={`flex h-14 items-center gap-4 text-lg ${isActive(href) ? "font-semibold text-gold" : "text-ink"}`}
                  >
                    <Icon className="h-5 w-5 text-muted" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <nav
        aria-label={t.menu}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-night/95 pb-[env(safe-area-inset-bottom)] backdrop-blur xl:hidden"
      >
        <ul className="mx-auto flex max-w-2xl">
          {tabs.map(({ href, label, Icon }) => {
            const active = !more && isActive(href);
            return (
              <li key={href} className="min-w-0 flex-1">
                <Link
                  href={`/${lang}${href}`}
                  onClick={() => setMore(false)}
                  aria-current={active ? "page" : undefined}
                  className={tab(active)}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="max-w-full truncate px-1">{label}</span>
                </Link>
              </li>
            );
          })}
          <li className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMore((v) => !v)}
              aria-expanded={more}
              aria-controls="more-menu"
              className={tab(moreActive)}
            >
              {more ? <X className="h-5 w-5" aria-hidden="true" /> : <Ellipsis className="h-5 w-5" aria-hidden="true" />}
              <span className="max-w-full truncate px-1">{t.tabMore}</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
