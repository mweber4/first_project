import { PageHeader, SectionTitle } from "@/components/cards";
import { getTechniques, type Technique } from "@/lib/data";
import { getDict, isLang, type Dict } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).techniquesTitle } : {};
}

function Entry({ item, n, t, tone }: { item: Technique; n: number; t: Dict; tone: "red" | "yellow" }) {
  return (
    <li
      className={`flex flex-col rounded-lg border border-line border-t-4 bg-card p-6 ${
        tone === "red" ? "border-t-tekhelet" : "border-t-gold"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-3xl font-bold leading-none ${
            tone === "red" ? "bg-tekhelet text-ink" : "bg-gold text-paper"
          }`}
        >
          {n}
        </span>
        <h3 className="text-balance pt-1.5 text-xl font-bold leading-snug">{item.title}</h3>
      </div>
      <blockquote
        lang="he"
        dir="rtl"
        className="mt-5 border-s-4 border-gold ps-4 text-start text-xl font-semibold leading-relaxed text-pop"
      >
        {item.quote}
      </blockquote>
      <p className="mt-4 flex-1 text-pretty leading-relaxed text-ink-soft">{item.text}</p>
      <p className="mt-5 border-t border-line pt-3 text-sm text-muted">
        <span className="font-semibold text-ink">{t.sourceLabel}: </span>
        {item.source}
      </p>
    </li>
  );
}

export default async function TechniquesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const all = getTechniques(lang);
  const groups = [
    { title: t.techniquesGroup, items: all.filter((x) => x.kind === "technique"), tone: "red" as const },
    { title: t.segulosGroup, items: all.filter((x) => x.kind === "segula"), tone: "yellow" as const },
  ];

  return (
    <>
      <PageHeader title={t.techniquesTitle} intro={t.techniquesIntro} />
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12">
        {groups.map((g) => (
          <section key={g.title}>
            <SectionTitle title={g.title} />
            <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item, i) => (
                <Entry key={item.id} item={item} n={i + 1} t={t} tone={g.tone} />
              ))}
            </ol>
          </section>
        ))}
        <p className="text-sm text-muted">{t.techniquesNote}</p>
      </div>
    </>
  );
}
