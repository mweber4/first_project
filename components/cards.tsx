import Link from "next/link";
import { CalendarDays, Clock, Headphones, MapPin, Play, Video as VideoIcon } from "lucide-react";
import type { Lecturer, Speech, Video } from "@/lib/data";
import type { Dict, Lang } from "@/lib/i18n";

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <h1 className="text-balance font-serif text-4xl font-black md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{intro}</p>}
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
    <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-ink pb-3">
      <h2 className="text-balance font-serif text-2xl font-bold md:text-3xl">
        <span className="mark">{title}</span>
      </h2>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-gold underline-offset-4 hover:underline">
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
      className={`flex shrink-0 items-center justify-center rounded-md bg-ink font-serif font-bold text-gold-soft ${
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
    <article className="group relative flex gap-4 border-b border-line py-5 transition-colors hover:bg-sand/60">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-ink text-ink transition-colors group-hover:bg-ink group-hover:text-gold-soft">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-lg font-bold leading-snug">
          <Link href={`/${lang}/speeches/${s.slug}`} dir="auto" className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-gold-soft group-hover:decoration-4 group-hover:underline-offset-2">
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
          <span className="rounded-sm bg-ink px-1.5 py-0.5 text-xs font-medium text-paper">
            {s.languageLabel}
          </span>
          {s.topics.map((tp) => (
            <span key={tp.id} className="text-xs">
              <span aria-hidden="true">#</span>
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
      className="group flex items-center gap-4 rounded-md border border-line bg-card p-4 transition-colors hover:border-ink"
    >
      <Avatar initials={l.initials} />
      <span className="min-w-0">
        <span className="block font-serif text-lg font-bold leading-tight decoration-gold-soft decoration-4 underline-offset-2 group-hover:underline">{l.name}</span>
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
      className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-ink-soft"
      style={v.poster ? { backgroundImage: `url(${v.poster})`, backgroundSize: "cover" } : undefined}
    >
      {!v.poster && (
        <span className="absolute inset-x-4 bottom-3 truncate text-start font-serif text-sm text-paper/70">
          {v.campaign ?? v.title}
        </span>
      )}
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-night transition-transform group-hover:scale-110">
        <Play className="ms-0.5 h-6 w-6 fill-current" aria-hidden="true" />
      </span>
      <span className="absolute end-2 top-2 rounded bg-black/55 px-1.5 py-0.5 text-xs text-paper">
        {v.minutes} {t.minutes}
      </span>
    </span>
  );
  const body = (
    <>
      {poster}
      <span className="mt-3 block font-serif text-lg font-bold leading-snug decoration-gold-soft decoration-4 underline-offset-2 group-hover:underline">
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
