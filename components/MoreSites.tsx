import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Dict } from "@/lib/i18n";

export function MoreSites({ t }: { t: Dict }) {
  const sites = [
    { name: "Vayimaen", host: "vayimaen.org", href: "https://www.vayimaen.org/", logo: "/images/sites/vayimaen.svg", text: t.siteVayimaen },
    { name: "Gibor", host: "yiddishvideos.com/@gibor2", href: "https://yiddishvideos.com/@gibor2", logo: "/images/sites/gibor.jpg", text: t.siteGibor },
    { name: "Guard Your Eyes", host: "guardyoureyes.com", href: "https://guardyoureyes.com/", logo: "/images/sites/guardyoureyes.svg", text: t.siteGye },
  ];

  return (
    <section aria-labelledby="more-sites" className="mx-auto max-w-6xl px-4 pb-8 pt-6">
      <h2 id="more-sites" className="font-display text-5xl font-bold uppercase leading-none">
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
              className="group flex h-full flex-col rounded-sm border border-line bg-card p-6 transition-colors hover:border-gold"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-snow p-2">
                    <Image
                      src={s.logo}
                      alt={`${s.name} logo`}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span dir="ltr" className="text-2xl font-black tracking-tight">
                    {s.name}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-tekhelet"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-3 flex-1 text-pretty leading-relaxed text-ink-soft">{s.text}</span>
              <span className="mt-5 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-tekhelet">{t.visitSite}</span>
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
