import Link from "next/link";
import Image from "next/image";
import { Headphones, Play, Video as VideoIcon } from "lucide-react";
import type { Lecturer, Speech, Video } from "@/lib/data";
import type { Dict, Lang } from "@/lib/i18n";

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-16 md:pt-20">
        <h1 className="max-w-4xl text-balance font-display text-6xl font-bold uppercase leading-[0.9] md:text-8xl">
          {title}
        </h1>
        {intro && <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">{intro}</p>}
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
    <div className="mb-8 flex items-baseline justify-between gap-4 border-t border-line pt-6">
      <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-gold">
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
        className={`shrink-0 rounded-full object-cover ${avatarSizes[size]}`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-card font-semibold text-muted ${avatarSizes[size]}`}
    >
      {initials}
    </span>
  );
}

export function SpeechCard({ speech: s, lang, t }: { speech: Speech; lang: Lang; t: Dict }) {
  const Icon = s.type === "video" ? VideoIcon : Headphones;
  return (
    <article className="group relative flex items-start gap-5 border-b border-line py-5">
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold leading-snug">
          <Link
            href={`/${lang}/speeches/${s.slug}`}
            dir="auto"
            className="transition-colors after:absolute after:inset-0 group-hover:text-gold"
          >
            {s.title}
          </Link>
        </h3>
        {s.altTitle && (
          <p className="mt-0.5 text-sm text-muted" dir="auto">
            {s.altTitle}
          </p>
        )}
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <Link
            href={`/${lang}/lecturers/${s.lecturerSlug}`}
            className="relative z-10 font-medium text-ink-soft hover:text-gold"
          >
            {s.lecturerName}
          </Link>
          <span aria-hidden="true">·</span>
          <span>{s.dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>
            {s.minutes} {t.minutes}
          </span>
          <span aria-hidden="true">·</span>
          <span>{s.languageLabel}</span>
        </p>
        {s.topics.length > 0 && (
          <p className="mt-1 text-xs text-muted/80">{s.topics.map((tp) => tp.label).join(" · ")}</p>
        )}
      </div>
      <Icon className="mt-1 h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-gold" aria-hidden="true" />
    </article>
  );
}

export function LecturerCard({ lecturer: l, lang, t }: { lecturer: Lecturer; lang: Lang; t: Dict }) {
  return (
    <Link href={`/${lang}/lecturers/${l.slug}`} className="group flex items-center gap-4 border-b border-line py-4">
      <Avatar initials={l.initials} photo={l.photo} />
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold leading-tight transition-colors group-hover:text-gold">{l.name}</span>
        <span className="mt-1 block text-sm text-muted">
          {l.role} · {l.location} · {l.speechCount} {t.speechesCount}
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
  tone = "red",
}: {
  video: Video;
  t: Dict;
  onPlay?: () => void;
  href?: string;
  tone?: "red" | "yellow";
}) {
  void tone;
  const poster = (
    <span
      className="relative flex aspect-video flex-col justify-between overflow-hidden rounded-sm border border-line bg-card p-5 transition-colors group-hover:border-gold"
      style={v.poster ? { backgroundImage: `url(${v.poster})`, backgroundSize: "cover" } : undefined}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="eyebrow truncate !text-muted">{v.campaign ?? v.year}</span>
        <span className="shrink-0 text-xs tabular-nums text-muted">
          {v.minutes} {t.minutes}
        </span>
      </span>
      {!v.poster && (
        <span className="line-clamp-2 text-start font-display text-4xl font-bold uppercase leading-[0.9] md:text-5xl">
          {v.title}
        </span>
      )}
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/30 text-ink transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-night">
        <Play className="ms-0.5 h-4 w-4 fill-current" aria-hidden="true" />
      </span>
    </span>
  );
  const body = (
    <>
      {poster}
      {v.poster && <span className="mt-3 block text-lg font-bold leading-snug">{v.title}</span>}
      <span className="mt-3 block text-sm leading-relaxed text-muted group-hover:text-ink-soft">{v.description}</span>
      <span className="mt-1 block text-xs text-muted">
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
