/**
 * Text normalisation shared by the site search and the directory filters.
 * Makes Hebrew / Yiddish matching forgiving: strips nikud and punctuation,
 * unifies final letters, Yiddish ligatures and doubled yud/vav spellings,
 * and lower-cases Latin text.
 */
const FINALS: Record<string, string> = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };

export function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[֑-ׇ̀-ͯ]/g, "") // nikud, cantillation, Latin accents
    .replace(/װ/g, "וו")
    .replace(/ױ/g, "וי")
    .replace(/ײ/g, "יי")
    .replace(/[ךםןףץ]/g, (c) => FINALS[c])
    .toLowerCase()
    .replace(/[־\-–—]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/([יו])\1+/g, "$1") // spelling variants: זילברשטין = זילברשטיין
    .replace(/\s+/g, " ")
    .trim();
}

export type SearchKind = "speech" | "lecturer" | "video" | "campaign" | "topic";

export type SearchDoc = {
  kind: SearchKind;
  href: string;
  title: string;
  subtitle: string;
  /** normalised: the title in every language */
  nTitle: string;
  /** normalised: everything else worth matching (names, topics, descriptions) */
  nBody: string;
};

export function makeDoc(
  doc: Pick<SearchDoc, "kind" | "href" | "title" | "subtitle">,
  titles: string[],
  body: string[],
): SearchDoc {
  return { ...doc, nTitle: normalize(titles.join(" ")), nBody: normalize(body.join(" ")) };
}

/** Every query word must appear somewhere; title matches rank higher. */
export function search(docs: SearchDoc[], query: string): SearchDoc[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  const scored: { doc: SearchDoc; score: number }[] = [];
  for (const doc of docs) {
    let score = 0;
    let ok = true;
    for (const t of tokens) {
      const words = doc.nTitle.split(" ");
      if (words.includes(t)) score += 10;
      else if (words.some((w) => w.startsWith(t))) score += 7;
      else if (doc.nTitle.includes(t)) score += 5;
      else if (doc.nBody.includes(t)) score += 2;
      else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    if (doc.kind === "lecturer" || doc.kind === "topic") score += 3;
    scored.push({ doc, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.doc);
}
