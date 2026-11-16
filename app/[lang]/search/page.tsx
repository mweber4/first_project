import { Suspense } from "react";
import { PageHeader } from "@/components/cards";
import { SearchResults } from "@/components/SearchResults";
import { getSearchIndex, getTopics } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).searchTitle } : {};
}

export default async function SearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  return (
    <>
      <PageHeader title={t.searchTitle} />
      <Suspense>
        <SearchResults
          docs={getSearchIndex(lang)}
          t={t}
          topics={getTopics(lang).map((tp) => ({
            href: `/${lang}/speeches?topic=${tp.id}`,
            label: tp.label,
          }))}
        />
      </Suspense>
    </>
  );
}
