"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Headphones, House, Search, Users } from "lucide-react";
import type { Dict, Lang } from "@/lib/i18n";

export function MobileTabBar({ lang, t }: { lang: Lang; t: Dict }) {
  const rest = usePathname().replace(/^\/[^/]+/, "");
  const tabs = [
    { href: "", label: t.navHome, Icon: House },
    { href: "/speeches", label: t.navSpeeches, Icon: Headphones },
    { href: "/lecturers", label: t.navLecturers, Icon: Users },
    { href: "/resources", label: t.tabResources, Icon: BookOpen },
    { href: "/search", label: t.searchButton, Icon: Search },
  ];

  return (
    <nav
      aria-label={t.menu}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-night/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div aria-hidden="true" className="brand-stripe" />
      <ul className="mx-auto flex max-w-2xl">
        {tabs.map(({ href, label, Icon }) => {
          const active = href === "" ? rest === "" : rest.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={`/${lang}${href}`}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
                  active ? "text-gold" : "text-muted hover:text-ink"
                }`}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-tekhelet text-ink" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="max-w-full truncate px-1">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
