import lecturersJson from "@/content/lecturers.json";
import speechesJson from "@/content/speeches.json";
import topicsJson from "@/content/topics.json";
import videosJson from "@/content/videos.json";
import siteJson from "@/content/site.json";
import techniquesJson from "@/content/techniques.json";
import { formatDate } from "./format";
import { getDict, localeNames, pick, type L10n, type Lang } from "./i18n";
import { makeDoc, normalize, type SearchDoc } from "./search";

/* ---------- Raw content (edit the JSON files in /content) ---------- */

type RawLecturer = {
  slug: string;
  name: { he: string; en: string };
  role: L10n;
  location: L10n;
  bio: L10n;
};
type RawSpeech = {
  slug: string;
  /** title in the language the speech was given in */
  title: string;
  titleEn: string;
  lecturer: string;
  language: Lang;
  topics: string[];
  date: string;
  minutes: number;
  type: "audio" | "video";
  series?: string;
  /** URL of the mp3 / mp4 file. Falls back to the bundled sample media. */
  src?: string;
};
type RawVideo = {
  slug: string;
  category: "inspiration" | "campaign";
  title: L10n;
  description: L10n;
  campaign?: L10n;
  year: number;
  minutes: number;
  src?: string;
  poster?: string;
};

const lecturers = lecturersJson as RawLecturer[];
const speeches = speechesJson as RawSpeech[];
const topics = topicsJson as { id: string; label: L10n }[];
const videos = videosJson as RawVideo[];
export const site = siteJson;

const SAMPLE_AUDIO = "/media/sample-audio.mp3";
const SAMPLE_VIDEO = "/media/sample-video.mp4";

/* ---------- View models, localised on the server ---------- */

export type Topic = { id: string; label: string; count: number };
export type Lecturer = {
  slug: string;
  name: string;
  altName: string;
  initials: string;
  photo: string;
  role: string;
  location: string;
  bio: string;
  speechCount: number;
  languages: string[];
  search: string;
};
export type Speech = {
  slug: string;
  title: string;
  /** shown under the title when it differs (the original, or the translation) */
  altTitle: string | null;
  lecturerSlug: string;
  lecturerName: string;
  language: Lang;
  languageLabel: string;
  topics: { id: string; label: string }[];
  date: string;
  dateLabel: string;
  minutes: number;
  type: "audio" | "video";
  series: string | null;
  src: string;
  search: string;
};
export type Video = {
  slug: string;
  category: "inspiration" | "campaign";
  title: string;
  description: string;
  campaign: string | null;
  year: number;
  minutes: number;
  src: string;
  poster: string | null;
};

function stripTitle(n: string) {
  return n.replace(/^(הרב|Rabbi)\s+/, "");
}

const lecturerName = (l: RawLecturer, lang: Lang) =>
  lang === "en" ? l.name.en : l.name.he;

const initialsOf = (name: string) => {
  const letters = stripTitle(name)
    .split(/[\s־-]+/)
    .filter(Boolean)
    .map((w) => w[0]);
  const pair = [letters[0], letters[letters.length - 1]];
  return /[a-z]/i.test(name) ? pair.join("") : pair.join("״");
};

export function getTopics(lang: Lang): Topic[] {
  return topics.map((t) => ({
    id: t.id,
    label: pick(t.label, lang),
    count: speeches.filter((s) => s.topics.includes(t.id)).length,
  }));
}

export function getLecturers(lang: Lang): Lecturer[] {
  return lecturers
    .map((l) => {
      const own = speeches.filter((s) => s.lecturer === l.slug);
      const name = lecturerName(l, lang);
      return {
        slug: l.slug,
        name,
        altName: lang === "en" ? l.name.he : l.name.en,
        initials: initialsOf(name),
        photo: `/images/speakers/${l.slug}.png`,
        role: pick(l.role, lang),
        location: pick(l.location, lang),
        bio: pick(l.bio, lang),
        speechCount: own.length,
        languages: [...new Set(own.map((s) => localeNames[s.language]))],
        search: normalize(
          [l.name.he, l.name.en, pick(l.role, lang), pick(l.location, lang), l.location.en].join(" "),
        ),
      };
    })
    .sort((a, b) =>
      stripTitle(a.name).localeCompare(stripTitle(b.name), lang === "en" ? "en" : "he"),
    );
}

export function getLecturer(slug: string, lang: Lang) {
  return getLecturers(lang).find((l) => l.slug === slug);
}

export function getSpeeches(lang: Lang): Speech[] {
  return speeches
    .map((s) => {
      const l = lecturers.find((x) => x.slug === s.lecturer)!;
      const showEn = lang === "en";
      const title = showEn ? s.titleEn : s.title;
      const alt = showEn ? s.title : s.titleEn;
      const topicLabels = s.topics.map((id) => {
        const t = topics.find((x) => x.id === id)!;
        return { id, label: pick(t.label, lang), all: Object.values(t.label).join(" ") };
      });
      return {
        slug: s.slug,
        title,
        altTitle: showEn && alt !== title ? alt : null,
        lecturerSlug: l.slug,
        lecturerName: lecturerName(l, lang),
        language: s.language,
        languageLabel: localeNames[s.language],
        topics: topicLabels.map(({ id, label }) => ({ id, label })),
        date: s.date,
        dateLabel: formatDate(s.date, lang),
        minutes: s.minutes,
        type: s.type,
        series: s.series ?? null,
        src: s.src ?? (s.type === "video" ? SAMPLE_VIDEO : SAMPLE_AUDIO),
        search: normalize(
          [s.title, s.titleEn, l.name.he, l.name.en, s.series ?? "", ...topicLabels.map((t) => t.all)].join(" "),
        ),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getSpeech(slug: string, lang: Lang) {
  return getSpeeches(lang).find((s) => s.slug === slug);
}

export function getVideos(lang: Lang): Video[] {
  return videos
    .map((v) => ({
      slug: v.slug,
      category: v.category,
      title: pick(v.title, lang),
      description: pick(v.description, lang),
      campaign: v.campaign ? pick(v.campaign, lang) : null,
      year: v.year,
      minutes: v.minutes,
      src: v.src ?? SAMPLE_VIDEO,
      poster: v.poster ?? null,
    }))
    .sort((a, b) => b.year - a.year);
}

export type Technique = {
  id: string;
  kind: "technique" | "segula";
  title: string;
  text: string;
  /** the words of the source, always in the original Hebrew */
  quote: string;
  source: string;
};

export function getTechniques(lang: Lang): Technique[] {
  return (techniquesJson as {
    id: string;
    kind: "technique" | "segula";
    title: L10n;
    text: L10n;
    quote: string;
    source: L10n;
  }[]).map((x) => ({
    id: x.id,
    kind: x.kind,
    title: pick(x.title, lang),
    text: pick(x.text, lang),
    quote: x.quote,
    source: pick(x.source, lang),
  }));
}

export const allSpeechSlugs = () => speeches.map((s) => s.slug);
export const allLecturerSlugs = () => lecturers.map((l) => l.slug);

/** One flat index over everything on the site, for the search page. */
export function getSearchIndex(lang: Lang): SearchDoc[] {
  const t = getDict(lang);
  const docs: SearchDoc[] = [];

  for (const l of lecturers) {
    docs.push(
      makeDoc(
        {
          kind: "lecturer",
          href: `/${lang}/lecturers/${l.slug}`,
          title: lecturerName(l, lang),
          subtitle: `${pick(l.role, lang)} · ${pick(l.location, lang)}`,
        },
        [l.name.he, l.name.en],
        [...Object.values(l.role), ...Object.values(l.location), ...Object.values(l.bio)],
      ),
    );
  }

  for (const tp of topics) {
    docs.push(
      makeDoc(
        {
          kind: "topic",
          href: `/${lang}/speeches?topic=${tp.id}`,
          title: pick(tp.label, lang),
          subtitle: `${speeches.filter((s) => s.topics.includes(tp.id)).length} ${t.speechesCount}`,
        },
        Object.values(tp.label),
        [],
      ),
    );
  }

  for (const s of getSpeeches(lang)) {
    const raw = speeches.find((x) => x.slug === s.slug)!;
    const l = lecturers.find((x) => x.slug === raw.lecturer)!;
    docs.push(
      makeDoc(
        {
          kind: "speech",
          href: `/${lang}/speeches/${s.slug}`,
          title: s.title,
          subtitle: `${s.lecturerName} · ${s.dateLabel} · ${s.languageLabel}`,
        },
        [raw.title, raw.titleEn],
        [
          l.name.he,
          l.name.en,
          raw.series ?? "",
          localeNames[raw.language],
          ...raw.topics.flatMap((id) => Object.values(topics.find((x) => x.id === id)!.label)),
        ],
      ),
    );
  }

  for (const v of videos) {
    docs.push(
      makeDoc(
        {
          kind: v.category === "campaign" ? "campaign" : "video",
          href: `/${lang}/resources?v=${v.slug}`,
          title: pick(v.title, lang),
          subtitle: `${v.campaign ? `${pick(v.campaign, lang)} · ` : ""}${v.year}`,
        },
        Object.values(v.title),
        [...Object.values(v.description), ...(v.campaign ? Object.values(v.campaign) : []), String(v.year)],
      ),
    );
  }

  return docs;
}
