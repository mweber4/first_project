import { PageHeader } from "@/components/cards";
import { LecturersBrowser } from "@/components/LecturersBrowser";
import { getLecturers } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).lecturersTitle } : {};
}

export default async function LecturersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  return (
    <>
      <PageHeader title={t.lecturersTitle} intro={t.lecturersIntro} />
      <LecturersBrowser lecturers={getLecturers(lang)} lang={lang} t={t} />
    </>
  );
}
