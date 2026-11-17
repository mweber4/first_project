import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Hebrew, Frank_Ruhl_Libre } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileTabBar } from "@/components/MobileTabBar";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ServiceWorker } from "@/components/ServiceWorker";
import { site } from "@/lib/data";
import { dirOf, getDict, isLang, locales } from "@/lib/i18n";

const plex = IBM_Plex_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
});
const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600"],
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
    applicationName: t.siteName,
    appleWebApp: { capable: true, title: t.siteName, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: false },
    icons: {
      icon: [{ url: "/icons/favicon-32.png", sizes: "32x32" }, { url: "/icons/icon-192.png", sizes: "192x192" }],
      apple: "/icons/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f3ec",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
    <html lang={lang} dir={dirOf(lang)} className={`${plex.variable} ${frank.variable} bg-paper [color-scheme:light]`}>
      <body className="flex min-h-dvh flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] font-sans antialiased lg:pb-0">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-card focus:px-3 focus:py-2"
        >
          {t.skipToContent}
        </a>
        {site.showDemoBanner && (
          <p className="border-b border-line bg-night px-4 py-1.5 text-center text-xs tracking-wide text-snow/70">
            {t.demoBanner}
          </p>
        )}
        <SiteHeader lang={lang} t={t} />
        <main id="content" className="flex-1 pb-24">
          {children}
        </main>
        <SiteFooter lang={lang} t={t} />
        <MobileTabBar lang={lang} t={t} />
        <InstallPrompt t={t} />
        <ServiceWorker />
      </body>
    </html>
  );
}
