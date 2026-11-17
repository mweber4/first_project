import { ArrowUpRight } from "lucide-react";
import type { Dict } from "@/lib/i18n";

export function MoreSites({ t }: { t: Dict }) {
  const sites = [
    { name: "Vayimaen", host: "vayimaen.org", href: "https://www.vayimaen.org/", text: t.siteVayimaen },
    { name: "Gibor", host: "yiddishvideos.com/@gibor2", href: "https://yiddishvideos.com/@gibor2", text: t.siteGibor },
    { name: "Guard Your Eyes", host: "guardyoureyes.com", href: "https://guardyoureyes.com/", text: t.siteGye },
  ];

  return (
    <section aria-labelledby="more-sites" className="mx-auto max-w-6xl px-4 pb-8 pt-6">
      <h2 id="more-sites" className="text-3xl font-black uppercase tracking-wide">
        {t.moreSitesTitle}
      </h2>
      <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-muted">{t.moreSitesIntro}</p>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {sites.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border border-line bg-card p-6 transition-colors hover:border-gold"
            >
              <span className="flex items-start justify-between gap-3">
                <span dir="ltr" className="text-2xl font-black tracking-tight">
                  {s.name}
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-gold"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-3 flex-1 text-pretty leading-relaxed text-ink-soft">{s.text}</span>
              <span className="mt-5 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-gold">{t.visitSite}</span>
                <span dir="ltr" className="truncate text-muted">
                  {s.host}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
