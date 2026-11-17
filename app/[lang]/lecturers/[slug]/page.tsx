import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Avatar, SpeechCard } from "@/components/cards";
import { allLecturerSlugs, getLecturer, getSpeeches } from "@/lib/data";
import { isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

type Params = Promise<{ lang: string; slug: string }>;

export const generateStaticParams = () => allLecturerSlugs().map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const l = isLang(lang) ? getLecturer(slug, lang) : undefined;
  return l ? { title: l.name } : {};
}

export default async function LecturerPage({ params }: { params: Params }) {
  const { lang, t, slug } = await resolveLang(params);
  const l = getLecturer(slug, lang);
  if (!l) notFound();
  const speeches = getSpeeches(lang).filter((s) => s.lecturerSlug === slug);

  return (
    <>
      <div className="border-b border-line bg-sand">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link href={`/${lang}/lecturers`} className="text-sm text-muted hover:text-ink hover:underline">
            <span aria-hidden="true" className="inline-block ltr:rotate-180">→</span> {t.backToLecturers}
          </Link>
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar initials={l.initials} photo={l.photo} size="lg" />
            <div>
              <h1 className="font-serif text-3xl font-bold md:text-4xl">{l.name}</h1>
              <p className="text-muted" dir="auto">
                {l.altName}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-medium">{l.role}</span>
                <span className="inline-flex items-center gap-1 text-muted">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {l.location}
                </span>
                {l.languages.map((x) => (
                  <span key={x} className="rounded-lg bg-card px-2.5 py-0.5 text-sm">
                    {x}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">{l.bio}</p>
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="mb-5 font-serif text-2xl font-bold">
          {t.allSpeechesBy} <span className="text-lg font-normal text-muted">({speeches.length})</span>
        </h2>
        <div className="grid gap-4">
          {speeches.map((s) => (
            <SpeechCard key={s.slug} speech={s} lang={lang} t={t} />
          ))}
        </div>
      </section>
    </>
  );
}
