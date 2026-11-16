import type { Lang } from "./i18n";

const ONES = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
const TENS = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
const HUNDREDS = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];

/** 21 → כ״א, 786 → תשפ״ו (the thousands of a year are dropped, as is customary). */
export function gematria(n: number): string {
  n = n % 1000;
  let s = HUNDREDS[Math.floor(n / 100)];
  const rest = n % 100;
  if (rest === 15) s += "טו";
  else if (rest === 16) s += "טז";
  else s += TENS[Math.floor(rest / 10)] + ONES[rest % 10];
  return s.length > 1 ? `${s.slice(0, -1)}״${s.slice(-1)}` : `${s}׳`;
}

/** Hebrew-calendar date: "כ״א באדר תשפ״ו" (he/yi) or "21 Adar 5786" (en). */
export function formatDate(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T12:00:00Z`);
  const fmt = new Intl.DateTimeFormat(
    lang === "en" ? "en-US-u-ca-hebrew" : "he-IL-u-ca-hebrew",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
  if (lang === "en") return fmt.format(date);
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  return `${gematria(Number(parts.day))} ב${parts.month} ${gematria(Number(parts.year))}`;
}
