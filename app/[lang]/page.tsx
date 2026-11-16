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
  const videos = getVideos(lang);
  const inspiration = videos.filter((v) => v.category === "inspiration");

  const stats = [
    { n: speeches.length, label: t.statSpeeches },
    { n: lecturers.length, label: t.statLecturers },
    { n: topics.length, label: t.statTopics },
    { n: inspiration.length, label: t.statVideos },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-ink to-night text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center md:py-24">
          <p lang="he" dir="rtl" className="font-serif text-2xl leading-relaxed text-gold-soft md:text-4xl">
            ״{t.heroVerse}״
          </p>
          <p className="mt-2 text-sm text-white/60">{t.heroVerseSource}</p>
          <h1 className="mt-8 font-serif text-3xl font-black md:text-5xl">{t.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{t.heroText}</p>

          <form action={`/${lang}/search`} role="search" className="relative mx-auto mt-8 max-w-xl">
            <Search
              className="pointer-events-none absolute start-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              placeholder={t.searchPlaceholder}
              aria-label={t.searchTitle}
              className="w-full rounded-full bg-white py-4 ps-13 pe-32 text-lg text-ink shadow-xl placeholder:text-muted focus:outline-none focus:ring-4 focus:ring-gold-soft/60"
            />
            <button
              type="submit"
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-ink px-6 py-2.5 font-semibold text-white hover:bg-gold"
            >
              {t.searchButton}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/${lang}/speeches`} className="rounded-full bg-gold-soft px-6 py-2.5 font-bold text-night hover:bg-white">
              {t.browseSpeeches}
            </Link>
            <Link href={`/${lang}/lecturers`} className="rounded-full border border-white/40 px-6 py-2.5 font-semibold hover:bg-white/10">
              {t.browseLecturers}
            </Link>
          </div>
        </div>

        <dl className="relative mx-auto grid max-w-4xl grid-cols-2 gap-px border-t border-white/10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse px-4 py-5 text-center">
              <dt className="text-sm text-white/65">{s.label}</dt>
              <dd className="font-serif text-3xl font-bold text-gold-soft">{s.n}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        <section>
          <SectionTitle title={t.latestSpeeches} href={`/${lang}/speeches`} linkLabel={t.viewAll} />
          <div className="grid gap-4 lg:grid-cols-2">
            {speeches.slice(0, 6).map((s) => (
              <SpeechCard key={s.slug} speech={s} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.browseByTopic} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {topics.map((tp) => (
              <Link
                key={tp.id}
                href={`/${lang}/speeches?topic=${tp.id}`}
                className="rounded-xl border border-line bg-white p-4 transition-colors hover:border-ink hover:bg-sand"
              >
                <span className="block font-serif text-lg font-bold leading-snug">{tp.label}</span>
                <span className="mt-1 block text-sm text-muted">
                  {tp.count} {t.speechesCount}
                </span>
              </Link>
            ))}
          </div>
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

      <section className="bg-sand">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-14 text-center">
          <h2 className="font-serif text-3xl font-bold">{t.donateBandTitle}</h2>
          <p className="mt-3 text-lg text-muted">{t.donateBandText}</p>
          <Link
            href={`/${lang}/donate`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-lg font-bold text-white hover:bg-gold"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {t.donateCta}
          </Link>
        </div>
      </section>
    </>
  );
}
