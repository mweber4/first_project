import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/lib/data";
import type { Dict, Lang } from "@/lib/i18n";

export function SiteFooter({ lang, t }: { lang: Lang; t: Dict }) {
  const links = [
    { href: "/speeches", label: t.navSpeeches },
    { href: "/lecturers", label: t.navLecturers },
    { href: "/resources", label: t.navResources },
    { href: "/techniques", label: t.navTechniques },
    { href: "/calls", label: t.navCalls },
    { href: "/search", label: t.searchTitle },
    { href: "/donate", label: t.navDonate },
  ];
  return (
    <footer className="mt-40 bg-tekhelet text-snow/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-28 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-snow">
            <Logo />
            <span className="font-serif text-xl font-bold">{t.siteName}</span>
          </div>
          <p className="mt-4 max-w-md leading-relaxed">{t.footerAbout}</p>
          {(site.contactEmail || site.contactPhone) && (
            <p className="mt-4 text-sm" dir="ltr">
              {[site.contactPhone, site.contactEmail].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <nav aria-label={t.footerExplore}>
          <h2 className="eyebrow !text-snow">{t.footerExplore}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={`/${lang}${l.href}`} className="hover:text-snow hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div aria-hidden="true" className="brand-stripe" />
      <div className="bg-night py-5 text-center text-sm text-snow/70">
        © {new Date().getFullYear()} {t.siteName} · {t.footerRights}
      </div>
    </footer>
  );
}
