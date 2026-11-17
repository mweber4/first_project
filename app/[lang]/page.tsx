import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { LecturerCard, SectionTitle, SpeechCard, VideoTile } from "@/components/cards";
import { getLecturers, getSpeeches, getTopics, getVideos } from "@/lib/data";
import { resolveLang } from "@/lib/params";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const speeches = getSpeeches(lang);
  const lecturers = getLecturers(lang);
  const topics = getTopics(lang);
  const inspiration = getVideos(lang).filter((v) => v.category === "inspiration");

  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-16 text-center md:pb-20 md:pt-24">
          <p lang="he" dir="rtl" className="text-pretty text-base font-medium text-gold md:text-lg">
            {t.heroVerse}
            <span className="ms-2 text-muted">({t.heroVerseSource})</span>
          </p>

          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-ink md:text-6xl">{t.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{t.heroText}</p>

          <form
            action={`/${lang}/search`}
            role="search"
            className="mt-9 flex w-full max-w-2xl items-center rounded-full border border-line bg-card p-1.5 shadow-sm focus-within:border-gold"
          >
            <label htmlFor="hero-search" className="sr-only">
              {t.searchTitle}
            </label>
            <span className="flex items-center ps-4 text-muted">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <input
              id="hero-search"
              type="search"
              name="q"
              placeholder={t.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-lg text-ink placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-gold px-6 py-3 font-semibold text-paper transition-colors hover:bg-night"
            >
              {t.searchButton}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-semibold">
            <Link
              href={`/${lang}/speeches`}
              className="rounded-full border border-line bg-card px-5 py-2.5 text-ink transition-colors hover:border-gold hover:text-gold"
            >
              {t.browseSpeeches}
            </Link>
            <Link
              href={`/${lang}/lecturers`}
              className="rounded-full border border-line bg-card px-5 py-2.5 text-ink transition-colors hover:border-gold hover:text-gold"
            >
              {t.browseLecturers}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-14">
        <section>
          <SectionTitle title={t.latestSpeeches} href={`/${lang}/speeches`} linkLabel={t.viewAll} />
          <div className="grid gap-x-10 lg:grid-cols-2">
            {speeches.slice(0, 6).map((s) => (
              <SpeechCard key={s.slug} speech={s} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.browseByTopic} />
          <ul className="flex flex-wrap gap-3">
            {topics.map((tp) => (
              <li key={tp.id}>
                <Link
                  href={`/${lang}/speeches?topic=${tp.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 font-medium text-ink transition-colors hover:border-gold hover:text-gold"
                >
                  {tp.label}
                  <span className="rounded-full bg-sand px-2 text-sm text-muted">{tp.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle title={t.ourLecturers} href={`/${lang}/lecturers`} linkLabel={t.viewAll} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lecturers.slice(0, 6).map((l) => (
              <LecturerCard key={l.slug} lecturer={l} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.inspirationTitle} href={`/${lang}/resources`} linkLabel={t.viewAll} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {inspiration.slice(0, 3).map((v) => (
              <VideoTile key={v.slug} video={v} t={t} href={`/${lang}/resources?v=${v.slug}`} />
            ))}
          </div>
        </section>
      </div>

      <section className="mx-auto -mb-20 max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gold px-8 py-10 text-paper md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight">{t.donateBandTitle}</h2>
            <p className="mt-2 max-w-xl text-lg leading-relaxed text-paper/85">{t.donateBandText}</p>
          </div>
          <Link
            href={`/${lang}/donate`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-7 py-3.5 text-lg font-bold text-gold transition-colors hover:bg-gold-soft"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {t.donateCta}
          </Link>
        </div>
      </section>
    </>
  );
}
