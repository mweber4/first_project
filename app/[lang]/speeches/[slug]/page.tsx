import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, Download } from "lucide-react";
import { Avatar, SectionTitle, SpeechCard } from "@/components/cards";
import { allSpeechSlugs, getLecturer, getSpeech, getSpeeches } from "@/lib/data";
import { isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

type Params = Promise<{ lang: string; slug: string }>;

export const generateStaticParams = () => allSpeechSlugs().map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Params }) {
  const { lang, slug } = await params;
  const s = isLang(lang) ? getSpeech(slug, lang) : undefined;
  return s ? { title: `${s.title} — ${s.lecturerName}` } : {};
}

export default async function SpeechPage({ params }: { params: Params }) {
  const { lang, t, slug } = await resolveLang(params);
  const s = getSpeech(slug, lang);
  if (!s) notFound();
  const lecturer = getLecturer(s.lecturerSlug, lang)!;
  const others = getSpeeches(lang).filter((x) => x.slug !== s.slug);
  const more = others.filter((x) => x.lecturerSlug === s.lecturerSlug).slice(0, 4);
  const related = others
    .filter((x) => x.lecturerSlug !== s.lecturerSlug && x.topics.some((a) => s.topics.some((b) => a.id === b.id)))
    .slice(0, 4);

  return (
    <>
      <div className="bg-night text-paper">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link href={`/${lang}/speeches`} className="text-sm text-paper/70 hover:text-paper hover:underline">
            <span aria-hidden="true" className="inline-block ltr:rotate-180">→</span> {t.backToSpeeches}
          </Link>
          {s.series && <p className="mt-6 text-sm font-semibold text-gold-soft">{s.series}</p>}
          <h1
            className={`font-serif text-3xl font-bold leading-tight md:text-4xl ${s.series ? "mt-1" : "mt-6"}`}
          >
            <span dir="auto">{s.title}</span>
          </h1>
          {s.altTitle && (
            <p className="mt-2 text-lg text-paper/70" dir="auto">
              {s.altTitle}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-paper/80">
            <Link href={`/${lang}/lecturers/${lecturer.slug}`} className="font-semibold text-gold-soft hover:underline">
              {s.lecturerName}
            </Link>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {s.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {s.minutes} {t.minutes}
            </span>
            <span className="rounded-lg bg-paper/15 px-2.5 py-0.5 text-sm">{s.languageLabel}</span>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg bg-black/30 ring-1 ring-paper/10">
            {s.type === "video" ? (
              <video src={s.src} controls playsInline preload="metadata" className="aspect-video w-full bg-black" />
            ) : (
              <div className="p-4">
                <audio src={s.src} controls preload="metadata" className="w-full" />
              </div>
            )}
          </div>
          <a
            href={s.src}
            download
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-paper/30 px-4 py-2 text-sm hover:bg-paper/10"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.download}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-10">
        <div className="flex flex-wrap gap-2">
          {s.topics.map((tp) => (
            <Link
              key={tp.id}
              href={`/${lang}/speeches?topic=${tp.id}`}
              className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm hover:border-gold"
            >
              {tp.label}
            </Link>
          ))}
        </div>

        <section className="flex gap-5 rounded-lg border border-line bg-card p-5">
          <Avatar initials={lecturer.initials} />
          <div>
            <h2 className="text-sm font-semibold text-muted">{t.aboutLecturer}</h2>
            <p className="font-serif text-xl font-bold">
              <Link href={`/${lang}/lecturers/${lecturer.slug}`} className="hover:text-gold">
                {lecturer.name}
              </Link>
            </p>
            <p className="text-sm text-muted">
              {lecturer.role} · {lecturer.location}
            </p>
            <p className="mt-2 leading-relaxed">{lecturer.bio}</p>
          </div>
        </section>

        {more.length > 0 && (
          <section>
            <SectionTitle title={t.moreFromLecturer} href={`/${lang}/lecturers/${lecturer.slug}`} linkLabel={t.viewAll} />
            <div className="grid gap-4">
              {more.map((x) => (
                <SpeechCard key={x.slug} speech={x} lang={lang} t={t} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section>
            <SectionTitle title={t.relatedSpeeches} />
            <div className="grid gap-4">
              {related.map((x) => (
                <SpeechCard key={x.slug} speech={x} lang={lang} t={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
