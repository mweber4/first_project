"use client";

import { useEffect, useState } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";
import { Logo } from "./Logo";
import type { Dict } from "@/lib/i18n";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "gye-install-dismissed";

export function InstallPrompt({ t }: { t: Dict }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone || localStorage.getItem(DISMISS_KEY)) return;

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    if (isIos) {
      setIos(true);
      setVisible(true);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => setVisible(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") setVisible(false);
  };

  return (
    <aside
      aria-label={t.installTitle}
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-2xl border border-line bg-card p-4 shadow-2xl shadow-night/60 lg:bottom-6 lg:end-6 lg:start-auto lg:mx-0"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-paper">
          <Logo className="h-8 w-8" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-ink">{t.installTitle}</p>
          {ios && !deferred ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {t.installIosStep1} <Share className="inline h-4 w-4 align-text-bottom text-gold" aria-label="Share" />{" "}
              {t.installIosStep2} <SquarePlus className="inline h-4 w-4 align-text-bottom text-gold" aria-hidden="true" />{" "}
              <strong className="text-ink">{t.installIosAction}</strong>
            </p>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.installText}</p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.installDismiss}
          className="-m-1 rounded-lg p-2 text-muted hover:bg-sand hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {deferred && (
        <button
          type="button"
          onClick={install}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 font-bold text-paper transition-colors hover:bg-pop"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          {t.installButton}
        </button>
      )}
    </aside>
  );
}
