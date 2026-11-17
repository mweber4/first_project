import Link from "next/link";
import { Eye, Heart, Play, Search } from "lucide-react";
import { Avatar, LecturerCard, SectionTitle, SpeechCard, VideoTile } from "@/components/cards";
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
      <section className="border-b border-line bg-night">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr] lg:py-14">
          <aside className="order-2 flex flex-col gap-5 lg:order-1">
            <form action={`/${lang}/search`} role="search" className="flex items-center gap-2 border-b border-ink/40 pb-2 focus-within:border-gold">
              <label htmlFor="hero-search" className="sr-only">
                {t.searchTitle}
              </label>
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                id="hero-search"
                type="search"
                name="q"
                placeholder={t.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-1.5 text-ink placeholder:text-muted focus:outline-none"
              />
              <button type="submit" className="eyebrow text-gold hover:text-ink">
                {t.searchButton}
              </button>
            </form>

            <nav aria-labelledby="hero-speakers" className="rounded-xl bg-card p-6">
              <h2 id="hero-speakers" className="eyebrow">
                {t.ourLecturers}
              </h2>
              <ul className="mt-4 flex flex-col gap-1">
                {lecturers.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/${lang}/lecturers/${l.slug}`}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-ink-soft transition-colors hover:bg-sand hover:text-ink"
                    >
                      <Avatar initials={l.initials} size="sm" />
                      <span className="truncate">{l.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/${lang}/lecturers`} className="mt-4 inline-block px-2 text-sm font-semibold text-gold hover:underline">
                {t.viewAll}
              </Link>
            </nav>
          </aside>

          <div className="order-1 flex flex-col lg:order-2">
            <Link
              href={featured ? `/${lang}/resources?v=${featured.slug}` : `/${lang}/speeches`}
              className="group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-xl border border-line bg-card p-6 md:aspect-video md:p-10"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="eyebrow">{t.featured}</span>
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 items-center justify-center rounded-full border border-ink/30 text-gold md:h-20 md:w-20"
                >
                  <Eye className="h-7 w-7 md:h-9 md:w-9" />
                </span>
              </span>

              <span className="flex flex-col gap-4">
                <span lang="he" dir="rtl" className="text-start text-base text-gold md:text-xl">
                  {t.heroVerse}
                  <span className="ms-2 text-muted">({t.heroVerseSource})</span>
                </span>
                <h1 className="max-w-4xl text-balance text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-7xl">
                  {t.heroTitle}
                </h1>
                {featured && (
                  <span className="inline-flex w-fit items-center gap-3 rounded-full bg-gold py-2 pe-5 ps-2 font-bold text-paper transition-transform group-hover:scale-105">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-gold">
                      <Play className="ms-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                    </span>
                    <span className="truncate">{featured.title}</span>
                    <span className="text-sm font-medium text-paper/70">
                      {featured.minutes} {t.minutes}
                    </span>
                  </span>
                )}
              </span>

              <span aria-hidden="true" className="flex items-center gap-3 text-xs text-muted">
                <span>0:00</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <span className="block h-full w-1/12 bg-gold" />
                </span>
                <span>{featured ? `${featured.minutes}:00` : ""}</span>
              </span>
            </Link>

            <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-ink-soft">{t.heroText}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/${lang}/speeches`} className="eyebrow rounded-full border border-ink/30 px-5 py-2.5 text-ink transition-colors hover:border-gold hover:text-gold">
                {t.browseSpeeches}
              </Link>
              <Link href={`/${lang}/resources`} className="eyebrow rounded-full border border-ink/30 px-5 py-2.5 text-ink transition-colors hover:border-gold hover:text-gold">
                {t.inspirationTitle}
              </Link>
            </div>
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
