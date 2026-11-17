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
      <div className="mx-auto max-w-6xl px-4 py-16">
        <ol className="grid gap-x-16 gap-y-8 md:grid-cols-3">
          {steps.map(([title, text], i) => (
            <li key={title} className="flex gap-5 border-t border-line pt-6">
              <span aria-hidden="true" className="font-display text-5xl font-bold leading-none text-tekhelet">
                {i + 1}
              </span>
              <span>
                <span className="block text-lg font-semibold">{title}</span>
                <span className="mt-1 block text-pretty leading-relaxed text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-16 lg:grid-cols-[3fr_2fr]">
          <CallScheduler t={t} speakers={speakers} topics={topics} preview={site.showDemoBanner} />
          <aside className="h-fit border-t border-line pt-6">
            <h2 className="text-2xl font-semibold tracking-tight">{t.callsKeysTitle}</h2>
            <ul className="mt-5 space-y-3">
              {keys.map(([key, label]) => (
                <li key={key} className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-line text-lg font-semibold tabular-nums text-tekhelet"
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
