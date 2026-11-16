import { Suspense } from "react";
import { PageHeader } from "@/components/cards";
import { SpeechesBrowser } from "@/components/SpeechesBrowser";
import { getLecturers, getSpeeches, getTopics } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).speechesTitle } : {};
}

export default async function SpeechesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  return (
    <>
      <PageHeader title={t.speechesTitle} intro={t.speechesIntro} />
      <Suspense>
        <SpeechesBrowser
          speeches={getSpeeches(lang)}
          lecturers={getLecturers(lang).map(({ slug, name }) => ({ slug, name }))}
          topics={getTopics(lang)}
          lang={lang}
          t={t}
        />
      </Suspense>
    </>
  );
}
