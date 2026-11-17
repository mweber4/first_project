import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, PhoneCall, Play } from "lucide-react";
import { SectionTitle, SpeakerPortrait, SpeechCard, VideoTile } from "@/components/cards";
import { getLecturers, getSpeeches, getTopics, getVideos } from "@/lib/data";
import { resolveLang } from "@/lib/params";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const speeches = getSpeeches(lang);
  const lecturers = getLecturers(lang);
  const topics = getTopics(lang);
  const featured = speeches.find((s) => s.slug === "bris-karati-leinai");
  const Arrow = lang === "en" ? ArrowRight : ArrowLeft;
  const inspiration = getVideos(lang).filter((v) => v.category === "inspiration");

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-20 lg:py-20">
          <div>
            <p className="text-sm leading-relaxed text-muted">
              <span lang="he" dir="rtl">{t.heroVerse}</span>
              <span className="mt-1 block text-xs">{t.heroVerseSource}</span>
            </p>
            <h1 className="mt-6 max-w-2xl text-balance font-display text-5xl sm:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted">{t.heroText}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href={`/${lang}/speeches`} className="btn btn-primary min-h-12">
                {t.browseSpeeches}<Arrow className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href={`/${lang}/resources`} className="py-3 text-sm text-ink-soft underline decoration-line underline-offset-8 hover:text-tekhelet">
                {t.inspirationTitle}
              </Link>
            </div>
          </div>

          {featured && (
            <aside className="flex min-h-80 flex-col justify-between bg-sand px-6 py-7 sm:px-8 sm:py-8" aria-label={t.featured}>
              <p className="eyebrow !text-muted">{t.featured}</p>
              <p lang="he" dir="rtl" className="py-10 text-start font-serif text-6xl leading-tight text-tekhelet sm:text-7xl">ברית כרתי<br />לעיני</p>
              <div className="flex items-center justify-between gap-4 border-t border-ink/15 pt-5">
                <div className="min-w-0">
                  <h2 className="text-pretty font-serif text-xl font-medium" dir="auto">{featured.title}</h2>
                  <p className="mt-2 flex flex-wrap gap-x-2 text-xs leading-relaxed text-muted">
                    <span>{featured.lecturerName}</span>
                    <span aria-hidden="true">·</span>
                    <bdi>{featured.minutes} {t.minutes}</bdi>
                    <span aria-hidden="true">·</span>
                    <bdi>{featured.languageLabel}</bdi>
                  </p>
                </div>
                <Link href={`/${lang}/speeches/${featured.slug}`} aria-label={`${t.listen}: ${featured.title}`} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-snow">
                  <Play className="ms-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          )}
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 py-14 md:gap-20 md:px-8 md:py-20">
        <section>
          <SectionTitle title={t.latestSpeeches} href={`/${lang}/speeches`} linkLabel={t.viewAll} />
          <div className="grid border-t border-ink md:gap-x-12 lg:grid-cols-2">
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
                  className="inline-flex min-h-11 items-center gap-3 border-b border-line px-3 text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-snow"
                >
                  {tp.label}
                  <span className="text-sm tabular-nums opacity-60">{tp.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="border-y border-line bg-sand text-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="flex items-start gap-4">
            <PhoneCall className="mt-1 h-7 w-7 shrink-0 text-tekhelet" aria-hidden="true" />
            <div>
              <h2 className="text-balance font-display text-3xl font-medium leading-tight md:text-4xl">
                {t.callsHomeTitle}
              </h2>
              <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">{t.callsHomeText}</p>
            </div>
          </div>
          <Link href={`/${lang}/calls`} className="btn btn-primary h-12 w-full shrink-0 sm:w-auto">
            {t.callsHomeCta}
          </Link>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 py-14 md:gap-20 md:px-8 md:py-20">
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

      <section className="-mb-24 border-t border-line bg-sand text-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center md:py-16">
          <div>
            <h2 className="text-balance font-display text-3xl font-medium leading-tight md:text-4xl">
              {t.donateBandTitle}
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{t.donateBandText}</p>
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
