import { Suspense } from "react";
import { PageHeader } from "@/components/cards";
import { ResourcesBrowser } from "@/components/ResourcesBrowser";
import { getVideos } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).navResources } : {};
}

export default async function ResourcesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  return (
    <>
      <PageHeader title={t.navResources} intro={t.resourcesIntro} />
      <Suspense>
        <ResourcesBrowser videos={getVideos(lang)} t={t} />
      </Suspense>
    </>
  );
}
