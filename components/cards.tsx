import Link from "next/link";
import { CalendarDays, Clock, Headphones, MapPin, Play, Video as VideoIcon } from "lucide-react";
import type { Lecturer, Speech, Video } from "@/lib/data";
import type { Dict, Lang } from "@/lib/i18n";

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="border-b border-line bg-sand">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-lg text-muted">{intro}</p>}
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-serif text-2xl font-bold md:text-3xl">
        <span className="border-b-[3px] border-gold-soft pb-1">{title}</span>
      </h2>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-gold hover:underline">
          {linkLabel} <span aria-hidden="true" className="inline-block rtl:rotate-180">→</span>
        </Link>
      )}
    </div>
  );
}

export function Avatar({ initials, size = "md" }: { initials: string; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-ink font-serif font-bold text-gold-soft ring-2 ring-gold-soft/60 ${
        size === "lg" ? "h-24 w-24 text-3xl" : "h-14 w-14 text-lg"
      }`}
    >
      {initials}
    </span>
  );
}

export function SpeechCard({ speech: s, lang, t }: { speech: Speech; lang: Lang; t: Dict }) {
  const Icon = s.type === "video" ? VideoIcon : Headphones;
  return (
    <article className="group relative flex gap-4 rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-md">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand text-ink transition-colors group-hover:bg-ink group-hover:text-gold-soft">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-bold leading-snug">
          <Link href={`/${lang}/speeches/${s.slug}`} dir="auto" className="after:absolute after:inset-0 hover:text-gold">
            {s.title}
          </Link>
        </h3>
        {s.altTitle && (
          <p className="mt-0.5 text-sm text-muted" dir="auto">
            {s.altTitle}
          </p>
        )}
        <p className="mt-1 text-[15px]">
          <Link
            href={`/${lang}/lecturers/${s.lecturerSlug}`}
            className="relative z-10 font-medium text-ink-soft hover:text-gold hover:underline"
          >
            {s.lecturerName}
          </Link>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {s.dateLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {s.minutes} {t.minutes}
          </span>
          <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-ink">
            {s.languageLabel}
          </span>
          {s.topics.map((tp) => (
            <span key={tp.id} className="rounded-full border border-line px-2 py-0.5 text-xs">
              {tp.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function LecturerCard({ lecturer: l, lang, t }: { lecturer: Lecturer; lang: Lang; t: Dict }) {
  return (
    <Link
      href={`/${lang}/lecturers/${l.slug}`}
      className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition-shadow hover:shadow-md"
    >
      <Avatar initials={l.initials} />
      <span className="min-w-0">
        <span className="block font-serif text-lg font-bold leading-tight">{l.name}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
          {l.role}
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {l.location}
          </span>
        </span>
        <span className="mt-1 block text-sm font-medium text-gold">
          {l.speechCount} {t.speechesCount}
        </span>
      </span>
    </Link>
  );
}

/** Poster tile for a video. Uses a designed placeholder when no poster image is set. */
export function VideoTile({
  video: v,
  t,
  onPlay,
  href,
}: {
  video: Video;
  t: Dict;
  onPlay?: () => void;
  href?: string;
}) {
  const poster = (
    <span
      className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-night via-ink to-ink-soft"
      style={v.poster ? { backgroundImage: `url(${v.poster})`, backgroundSize: "cover" } : undefined}
    >
      {!v.poster && (
        <span className="absolute inset-x-4 bottom-3 truncate text-start font-serif text-sm text-white/50">
          {v.campaign ?? v.title}
        </span>
      )}
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-night shadow-lg transition-transform group-hover:scale-110">
        <Play className="ms-0.5 h-6 w-6 fill-current" aria-hidden="true" />
      </span>
      <span className="absolute end-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-xs text-white">
        {v.minutes} {t.minutes}
      </span>
    </span>
  );
  const body = (
    <>
      {poster}
      <span className="mt-3 block font-serif text-lg font-bold leading-snug group-hover:text-gold">
        {v.title}
      </span>
      <span className="mt-1 block text-sm text-muted">{v.description}</span>
      <span className="mt-1 block text-xs font-medium text-gold">
        {v.campaign ? `${t.campaign}: ${v.campaign} · ` : ""}
        {v.year}
      </span>
    </>
  );
  return href ? (
    <Link href={href} className="group block text-start">
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onPlay} className="group block w-full cursor-pointer text-start">
      <span className="sr-only">{t.watch}: </span>
      {body}
    </button>
  );
}
