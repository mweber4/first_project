import Image from "next/image";
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
      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-10 md:grid-cols-[1.15fr_1fr] md:gap-14 md:pb-16 md:pt-14">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-muted">{t.heroVerseSource}</p>
            <p
              lang="he"
              dir="rtl"
              className="mt-3 text-balance font-serif text-4xl font-black leading-[1.2] text-ink md:text-6xl"
            >
              {t.heroVerse}
            </p>

            <h1 className="mt-8 text-balance font-serif text-2xl font-bold md:text-3xl">
              <span className="mark">{t.heroTitle}</span>
            </h1>
            <p className="mt-3 max-w-xl text-pretty text-lg leading-relaxed text-muted">{t.heroText}</p>

            <form action={`/${lang}/search`} role="search" className="mt-8 flex max-w-xl border-2 border-ink bg-card">
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
                className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-lg text-ink placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="bg-ink px-6 font-semibold text-paper transition-colors hover:bg-gold"
              >
                {t.searchButton}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-semibold">
              <Link href={`/${lang}/speeches`} className="text-gold underline decoration-2 underline-offset-4 hover:text-ink">
                {t.browseSpeeches}
              </Link>
              <Link href={`/${lang}/lecturers`} className="text-gold underline decoration-2 underline-offset-4 hover:text-ink">
                {t.browseLecturers}
              </Link>
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-md md:min-h-0">
            <Image
              src="/images/beis-medrash-shelves.png"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
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
          <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-3 font-serif text-2xl leading-snug md:text-3xl">
            {topics.map((tp, i) => (
              <li key={tp.id} className="flex items-baseline gap-2">
                <Link
                  href={`/${lang}/speeches?topic=${tp.id}`}
                  className="font-bold decoration-gold-soft decoration-[0.35em] underline-offset-[-0.1em] hover:underline"
                >
                  {tp.label}
                  <sup className="ms-1 font-sans text-sm font-medium text-muted">{tp.count}</sup>
                </Link>
                {i < topics.length - 1 && (
                  <span aria-hidden="true" className="text-line">
                    /
                  </span>
                )}
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

      <section className="-mb-20 border-b border-paper/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-balance font-serif text-3xl font-bold">{t.donateBandTitle}</h2>
            <p className="mt-2 max-w-xl text-lg leading-relaxed text-paper/75">{t.donateBandText}</p>
          </div>
          <Link
            href={`/${lang}/donate`}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-gold-soft px-7 py-3.5 text-lg font-bold text-night transition-colors hover:bg-paper"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {t.donateCta}
          </Link>
        </div>
      </section>
    </>
  );
}
