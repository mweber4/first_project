import Link from "next/link";
import { Heart, PhoneCall, Play, Search } from "lucide-react";
import { LecturerCard, SectionTitle, SpeechCard, VideoTile } from "@/components/cards";
import { getLecturers, getSpeeches, getTopics, getVideos } from "@/lib/data";
import { resolveLang } from "@/lib/params";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const speeches = getSpeeches(lang);
  const lecturers = getLecturers(lang);
  const topics = getTopics(lang);
  const inspiration = getVideos(lang).filter((v) => v.category === "inspiration");
  const featured = inspiration[0];

  return (
    <>
      <section className="bg-tekhelet">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16 lg:py-20">
          <div>
            <p className="flex flex-wrap items-baseline gap-x-3 text-lg text-ink/90 md:text-xl">
              <span lang="he" dir="rtl">
                {t.heroVerse}
              </span>
              <span className="text-sm text-ink/60">{t.heroVerseSource}</span>
            </p>
            <h1 className="mt-6 text-balance font-display text-7xl font-bold uppercase leading-[0.82] sm:text-8xl lg:text-9xl">
              {t.heroTitle}
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-ink/90">{t.heroText}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={`/${lang}/speeches`} className="btn btn-primary">
                {t.browseSpeeches}
              </Link>
              <Link
                href={`/${lang}/resources`}
                className="font-semibold underline decoration-ink/40 underline-offset-8 transition-colors hover:decoration-ink"
              >
                {t.inspirationTitle} <span aria-hidden="true" className="inline-block rtl:rotate-180">→</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <form
              action={`/${lang}/search`}
              role="search"
              className="flex items-center gap-3 border-b border-ink/50 pb-3 focus-within:border-ink"
            >
              <label htmlFor="hero-search" className="sr-only">
                {t.searchTitle}
              </label>
              <Search className="h-5 w-5 shrink-0 text-ink/70" aria-hidden="true" />
              <input
                id="hero-search"
                type="search"
                name="q"
                placeholder={t.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-1 text-lg text-ink placeholder:text-ink/60 focus:outline-none"
              />
              <button type="submit" className="eyebrow !text-ink hover:underline">
                {t.searchButton}
              </button>
            </form>

            {featured && (
              <Link href={`/${lang}/resources?v=${featured.slug}`} className="group flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-tekhelet transition-colors group-hover:bg-gold group-hover:text-night">
                  <Play className="ms-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="eyebrow !text-ink/70">{t.featured}</span>
                  <span className="mt-1 block truncate text-lg font-semibold">{featured.title}</span>
                  <span className="block text-sm text-ink/70">
                    {featured.minutes} {t.minutes}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-20">
        <section>
          <SectionTitle title={t.latestSpeeches} href={`/${lang}/speeches`} linkLabel={t.viewAll} />
          <div className="grid gap-x-16 lg:grid-cols-2">
            {speeches.slice(0, 6).map((s) => (
              <SpeechCard key={s.slug} speech={s} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.browseByTopic} />
          <ul className="flex flex-wrap gap-x-10 gap-y-4">
            {topics.map((tp) => (
              <li key={tp.id}>
                <Link
                  href={`/${lang}/speeches?topic=${tp.id}`}
                  className="inline-flex items-baseline gap-2 text-xl font-medium transition-colors hover:text-gold md:text-2xl"
                >
                  {tp.label}
                  <span className="text-sm tabular-nums text-muted">{tp.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle title={t.ourLecturers} href={`/${lang}/lecturers`} linkLabel={t.viewAll} />
          <div className="grid gap-x-16 sm:grid-cols-2 lg:grid-cols-3">
            {lecturers.slice(0, 6).map((l) => (
              <LecturerCard key={l.slug} lecturer={l} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.inspirationTitle} href={`/${lang}/resources`} linkLabel={t.viewAll} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {inspiration.slice(0, 3).map((v) => (
              <VideoTile key={v.slug} video={v} t={t} href={`/${lang}/resources?v=${v.slug}`} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 border-t border-line pt-10 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
          <div>
            <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{t.callsHomeTitle}</h2>
            <p className="mt-3 max-w-xl text-pretty text-lg leading-relaxed text-muted">{t.callsHomeText}</p>
          </div>
          <Link href={`/${lang}/calls`} className="btn btn-outline">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            {t.callsHomeCta}
          </Link>
        </section>
      </div>

      <section className="-mb-24 bg-gold text-night">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">{t.donateBandTitle}</h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-night/80">{t.donateBandText}</p>
          </div>
          <Link href={`/${lang}/donate`} className="btn btn-dark shrink-0">
            <Heart className="h-4 w-4" aria-hidden="true" />
            {t.donateCta}
          </Link>
        </div>
      </section>
    </>
  );
}
