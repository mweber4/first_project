"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { VideoTile } from "./cards";
import type { Video } from "@/lib/data";
import type { Dict } from "@/lib/i18n";

export function ResourcesBrowser({ videos, t }: { videos: Video[]; t: Dict }) {
  const params = useSearchParams();
  const linked = videos.find((v) => v.slug === params.get("v"));
  const [tab, setTab] = useState<Video["category"]>(linked?.category ?? "inspiration");
  const [playing, setPlaying] = useState<Video | null>(linked ?? null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (playing && !d.open) d.showModal();
    if (!playing && d.open) d.close();
  }, [playing]);

  const tabs = [
    { id: "inspiration" as const, label: t.inspirationTitle, intro: t.inspirationIntro },
    { id: "campaign" as const, label: t.campaignsTitle, intro: t.campaignsIntro },
  ];
  const current = tabs.find((x) => x.id === tab)!;
  const list = videos.filter((v) => v.category === tab);
  const years = [...new Set(list.map((v) => v.year))];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div role="tablist" className="flex gap-2 border-b border-line">
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`-mb-px border-b-[3px] px-4 py-3 text-lg transition-colors ${
              tab === x.id
                ? "border-gold font-bold text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {x.label}{" "}
            <span className="text-sm opacity-60">
              ({videos.filter((v) => v.category === x.id).length})
            </span>
          </button>
        ))}
      </div>

      <p className="mt-5 text-muted">{current.intro}</p>

      {tab === "campaign" ? (
        years.map((y) => (
          <section key={y} className="mt-8">
            <h2 className="mb-4 flex items-center gap-3 font-serif text-2xl font-bold">
              {y}
              <span className="h-px flex-1 bg-line" />
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list
                .filter((v) => v.year === y)
                .map((v) => (
                  <VideoTile key={v.slug} video={v} t={t} onPlay={() => setPlaying(v)} />
                ))}
            </div>
          </section>
        ))
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => (
            <VideoTile key={v.slug} video={v} t={t} onPlay={() => setPlaying(v)} />
          ))}
        </div>
      )}

      <dialog
        ref={dialog}
        onClose={() => setPlaying(null)}
        onClick={(e) => e.target === dialog.current && setPlaying(null)}
        aria-label={playing?.title}
        className="m-auto w-[min(92vw,960px)] rounded-md bg-night p-0 text-paper backdrop:bg-black/75"
      >
        {playing && (
          <>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <h2 className="font-serif text-lg font-bold">{playing.title}</h2>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                aria-label={t.close}
                className="rounded-md p-1.5 hover:bg-paper/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <video
              key={playing.slug}
              src={playing.src}
              poster={playing.poster ?? undefined}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full bg-black"
            />
            <p className="px-4 py-3 text-sm text-paper/75">{playing.description}</p>
          </>
        )}
      </dialog>
    </div>
  );
}
