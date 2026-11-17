import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Clock, Headphones, MapPin, Play, Video as VideoIcon } from "lucide-react";
import type { Lecturer, Speech, Video } from "@/lib/data";
import type { Dict, Lang } from "@/lib/i18n";

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
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
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-3">
      <h2 className="flex items-center gap-3 text-balance font-display text-4xl font-bold uppercase leading-none md:text-5xl">
        <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-gold" />
        {title}
      </h2>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-gold underline-offset-4 hover:underline">
          {linkLabel} <span aria-hidden="true" className="inline-block rtl:rotate-180">→</span>
        </Link>
      )}
    </div>
  );
}

const avatarSizes = { sm: "h-8 w-8 text-xs", md: "h-14 w-14 text-lg", lg: "h-28 w-28 text-3xl" };
const avatarPixels = { sm: 32, md: 56, lg: 112 };

export function Avatar({
  initials,
  photo,
  size = "md",
}: {
  initials: string;
  photo?: string;
  size?: keyof typeof avatarSizes;
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt=""
        width={avatarPixels[size]}
        height={avatarPixels[size]}
        className={`shrink-0 rounded-full object-cover ring-2 ring-gold/60 ${avatarSizes[size]}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-gold-soft font-bold text-gold ring-1 ring-gold/30 ${avatarSizes[size]}`}
    >
      {initials}
    </span>
  );
}

export function SpeechCard({ speech: s, lang, t }: { speech: Speech; lang: Lang; t: Dict }) {
  const Icon = s.type === "video" ? VideoIcon : Headphones;
  return (
    <article className="group relative flex gap-4 border-b border-line py-5 transition-colors hover:bg-sand/60">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold transition-colors group-hover:bg-gold group-hover:text-paper">
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
          <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-medium text-ink-soft">
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
      className="group flex items-center gap-4 rounded-lg border border-line bg-card p-4 transition-colors hover:border-gold"
    >
      <Avatar initials={l.initials} photo={l.photo} />
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
      className="relative flex aspect-video flex-col justify-between overflow-hidden rounded-lg border border-transparent bg-tekhelet p-4 transition-colors group-hover:border-gold"
      style={v.poster ? { backgroundImage: `url(${v.poster})`, backgroundSize: "cover" } : undefined}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="eyebrow truncate">{v.campaign ?? v.year}</span>
        <span className="shrink-0 rounded bg-night/70 px-1.5 py-0.5 text-xs text-snow">
          {v.minutes} {t.minutes}
        </span>
      </span>
      {!v.poster && (
        <span className="line-clamp-2 text-start font-display text-4xl font-bold uppercase leading-[0.9] text-ink md:text-5xl">
          {v.title}
        </span>
      )}
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-paper transition-transform group-hover:scale-110">
        <Play className="ms-0.5 h-5 w-5 fill-current" aria-hidden="true" />
      </span>
    </span>
  );
  const body = (
    <>
      {poster}
      {v.poster && <span className="mt-3 block text-lg font-bold leading-snug">{v.title}</span>}
      <span className="mt-3 block text-sm leading-relaxed text-muted group-hover:text-ink-soft">{v.description}</span>
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
