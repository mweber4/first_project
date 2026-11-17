import { PageHeader, SectionTitle } from "@/components/cards";
import { getTechniques, type Technique } from "@/lib/data";
import { getDict, isLang, type Dict } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).techniquesTitle } : {};
}

function Entry({ item, n, t }: { item: Technique; n: number; t: Dict }) {
  return (
    <li className="grid gap-x-6 border-b border-line py-8 sm:grid-cols-[3.5rem_1fr]">
      <span aria-hidden="true" className="font-display text-5xl font-bold leading-none text-gold">
        {String(n).padStart(2, "0")}
      </span>
      <div>
        <h3 className="text-balance text-xl font-semibold leading-snug">{item.title}</h3>
        <blockquote lang="he" dir="rtl" className="mt-3 text-start text-2xl font-medium leading-relaxed text-ink">
          {item.quote}
        </blockquote>
        <p className="mt-3 max-w-prose text-pretty leading-relaxed text-muted">{item.text}</p>
        <p className="mt-4 text-sm text-ink-soft">
          <span className="eyebrow !text-muted">{t.sourceLabel}</span>
          <span className="ms-3">{item.source}</span>
        </p>
      </div>
    </li>
  );
}

export default async function TechniquesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const all = getTechniques(lang);
  const groups = [
    { title: t.techniquesGroup, items: all.filter((x) => x.kind === "technique") },
    { title: t.segulosGroup, items: all.filter((x) => x.kind === "segula") },
  ];

  return (
    <>
      <PageHeader title={t.techniquesTitle} intro={t.techniquesIntro} />
      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-16">
        {groups.map((g) => (
          <section key={g.title}>
            <SectionTitle title={g.title} />
            <ol className="-mt-8 grid gap-x-16 lg:grid-cols-2">
              {g.items.map((item, i) => (
                <Entry key={item.id} item={item} n={i + 1} t={t} />
              ))}
            </ol>
          </section>
        ))}
        <p className="text-sm text-muted">{t.techniquesNote}</p>
      </div>
    </>
  );
}
