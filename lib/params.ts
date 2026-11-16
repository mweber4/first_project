import { notFound } from "next/navigation";
import { getDict, isLang, type Lang } from "./i18n";

/** Resolve the [lang] route segment into a validated language + dictionary. */
export async function resolveLang<T extends { lang: string }>(params: Promise<T>) {
  const p = await params;
  if (!isLang(p.lang)) notFound();
  return { ...p, lang: p.lang as Lang, t: getDict(p.lang as Lang) };
}
