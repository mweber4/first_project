import { PageHeader } from "@/components/cards";
import { CallScheduler } from "@/components/CallScheduler";
import { getLecturers, getTopics, site } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).navCalls } : {};
}

export default async function CallsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = await resolveLang(params);
  const speakers = getLecturers(lang).map((l) => ({ id: l.slug, label: l.name }));
  const topics = getTopics(lang).map((tp) => ({ id: tp.id, label: tp.label }));

  const steps = [
    [t.callsStep1Title, t.callsStep1Text],
    [t.callsStep2Title, t.callsStep2Text],
    [t.callsStep3Title, t.callsStep3Text],
  ];
  const keys = [
    ["1", t.callsKeyPause],
    ["4", t.callsKeyBack],
    ["6", t.callsKeyNext],
    ["9", t.callsKeyStop],
  ];

  return (
    <>
      <PageHeader title={t.callsTitle} intro={t.callsIntro} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(([title, text], i) => (
            <li key={title} className="flex gap-4 rounded-lg border border-line border-t-4 border-t-tekhelet bg-card p-5">
              <span aria-hidden="true" className="font-display text-6xl font-bold leading-[0.8] text-gold">
                {i + 1}
              </span>
              <span>
                <span className="block text-lg font-bold">{title}</span>
                <span className="mt-1 block text-pretty leading-relaxed text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-[3fr_2fr]">
          <CallScheduler t={t} speakers={speakers} topics={topics} preview={site.showDemoBanner} />
          <aside className="h-fit rounded-xl border-t-4 border-gold bg-card p-6">
            <h2 className="font-display text-4xl font-bold uppercase leading-none">{t.callsKeysTitle}</h2>
            <ul className="mt-5 space-y-3">
              {keys.map(([key, label]) => (
                <li key={key} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-tekhelet text-xl font-bold text-ink"
                  >
                    {key}
                  </span>
                  <span className="leading-relaxed">
                    <span className="sr-only">{key}: </span>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-line pt-5 text-sm text-muted">{t.callsNoShabbos}</p>
          </aside>
        </div>
      </div>
    </>
  );
}
