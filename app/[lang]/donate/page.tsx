import { Check } from "lucide-react";
import { PageHeader } from "@/components/cards";
import { DonateForm } from "@/components/DonateForm";
import { site } from "@/lib/data";
import { getDict, isLang } from "@/lib/i18n";
import { resolveLang } from "@/lib/params";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return isLang(lang) ? { title: getDict(lang).navDonate } : {};
}

export default async function DonatePage({ params }: { params: Promise<{ lang: string }> }) {
  const { t } = await resolveLang(params);
  const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL || site.donateUrl;
  return (
    <>
      <PageHeader title={t.donateTitle} intro={t.donateIntro} />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[3fr_2fr]">
        <DonateForm t={t} donateUrl={donateUrl} />
        <aside className="h-fit border-t border-line pt-6 text-ink-soft">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{t.donateWhyTitle}</h2>
          <ul className="mt-4 space-y-3">
            {[t.donateWhy1, t.donateWhy2, t.donateWhy3].map((x) => (
              <li key={x} className="flex gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-tekhelet" aria-hidden="true" />
                <span className="leading-relaxed">{x}</span>
              </li>
            ))}
          </ul>
          <p lang="he" dir="rtl" className="mt-6 border-t border-snow/15 pt-5 font-serif text-lg text-snow/85">
            ״כָּל הַמְזַכֶּה אֶת הָרַבִּים — אֵין חֵטְא בָּא עַל יָדוֹ״
            <span className="mt-1 block font-sans text-sm text-snow/55">אבות ה, יח</span>
          </p>
        </aside>
      </div>
    </>
  );
}
