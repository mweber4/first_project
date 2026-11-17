import Link from "next/link";
import Image from "next/image";
import { Heart, PhoneCall } from "lucide-react";
import { SectionTitle, SpeakerPortrait, SpeechCard, VideoTile } from "@/components/cards";
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
      <section className="bg-tekhelet text-snow">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-12 pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <p className="flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
              <span lang="he" dir="rtl" className="text-lg leading-relaxed text-snow/90 md:text-xl">
                {t.heroVerse}
              </span>
              <span className="whitespace-nowrap text-sm text-snow/70">{t.heroVerseSource}</span>
            </p>
            <h1 className="mt-5 text-balance font-display text-6xl font-bold uppercase leading-[0.85] sm:text-8xl lg:text-9xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-snow/90">{t.heroText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/${lang}/speeches`} className="btn btn-primary h-12">
                {t.browseSpeeches}
              </Link>
              <Link href={`/${lang}/resources`} className="btn btn-outline h-12">
                {t.inspirationTitle}
              </Link>
            </div>
          </div>

          <Link href={`/${lang}/lecturers`} className="group block" aria-label={t.ourLecturers}>
            <span className="grid grid-cols-6 gap-1.5 lg:grid-cols-3 lg:gap-2">
              {lecturers.slice(0, 6).map((l) => (
                <Image
                  key={l.slug}
                  src={l.photo}
                  alt=""
                  width={200}
                  height={250}
                  className="aspect-[4/5] h-auto w-full rounded-sm object-cover"
                />
              ))}
            </span>
            <span className="mt-3 block text-sm font-semibold text-snow/90 underline decoration-snow/40 underline-offset-4 group-hover:decoration-snow">
              {t.ourLecturers}
            </span>
          </Link>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-14 md:gap-20 md:py-20">
        <section>
          <SectionTitle title={t.latestSpeeches} href={`/${lang}/speeches`} linkLabel={t.viewAll} />
          <div className="grid border-t-2 border-ink md:gap-x-12 lg:grid-cols-2">
            {speeches.slice(0, 6).map((s) => (
              <SpeechCard key={s.slug} speech={s} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.browseByTopic} />
          <ul className="flex flex-wrap gap-2">
            {topics.map((tp) => (
              <li key={tp.id}>
                <Link
                  href={`/${lang}/speeches?topic=${tp.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-sm border border-ink/20 bg-card px-4 font-medium transition-colors hover:border-ink hover:bg-ink hover:text-snow"
                >
                  {tp.label}
                  <span className="text-sm tabular-nums opacity-60">{tp.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-night text-snow">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex items-start gap-4">
            <PhoneCall className="mt-1 h-7 w-7 shrink-0 text-gold" aria-hidden="true" />
            <div>
              <h2 className="text-balance font-display text-4xl font-bold uppercase leading-[0.9] md:text-5xl">
                {t.callsHomeTitle}
              </h2>
              <p className="mt-3 max-w-xl text-pretty leading-relaxed text-snow/75">{t.callsHomeText}</p>
            </div>
          </div>
          <Link href={`/${lang}/calls`} className="btn btn-primary h-12 w-full shrink-0 sm:w-auto">
            {t.callsHomeCta}
          </Link>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-14 md:gap-20 md:py-20">
        <section>
          <SectionTitle title={t.ourLecturers} href={`/${lang}/lecturers`} linkLabel={t.viewAll} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {lecturers.slice(0, 6).map((l) => (
              <SpeakerPortrait key={l.slug} lecturer={l} lang={lang} t={t} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title={t.inspirationTitle} href={`/${lang}/resources`} linkLabel={t.viewAll} />
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {inspiration.slice(0, 3).map((v) => (
              <div key={v.slug} className="w-[80%] shrink-0 snap-start sm:w-auto">
                <VideoTile video={v} t={t} href={`/${lang}/resources?v=${v.slug}`} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="-mb-24 bg-gold text-night">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center md:py-16">
          <div>
            <h2 className="text-balance font-display text-5xl font-bold uppercase leading-[0.85] md:text-6xl">
              {t.donateBandTitle}
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-night/80">{t.donateBandText}</p>
          </div>
          <Link href={`/${lang}/donate`} className="btn btn-dark h-12 w-full shrink-0 sm:w-auto">
            <Heart className="h-4 w-4" aria-hidden="true" />
            {t.donateCta}
          </Link>
        </div>
      </section>
    </>
  );
}
