import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/data";
import { dirOf, getDict, isLang, locales } from "@/lib/i18n";

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo" });
const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "900"],
  variable: "--font-frank",
});

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return {
    title: { default: `${t.siteName} — ${t.tagline}`, template: `%s · ${t.siteName}` },
    description: t.heroText,
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${heebo.variable} ${frank.variable} bg-paper [color-scheme:dark]`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-card focus:px-3 focus:py-2"
        >
          {t.skipToContent}
        </a>
        {site.showDemoBanner && (
          <p className="border-b border-line bg-night px-4 py-1.5 text-center text-xs font-medium tracking-wide text-pop">
            {t.demoBanner}
          </p>
        )}
        <SiteHeader lang={lang} t={t} />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter lang={lang} t={t} />
      </body>
    </html>
  );
}
