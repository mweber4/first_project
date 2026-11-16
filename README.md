# שמירת עינים · Guard Your Eyes

Website for the Guard Your Eyes (Shmiras Einayim) organization: a searchable
library of speeches by many lecturers, a resources section (inspirational
videos and past campaign videos), and a donation page.

Built with Next.js (App Router), TypeScript and Tailwind CSS — the same stack
v0 generates, so the repository can be imported into v0 and deployed on Vercel.

## Languages

Hebrew (default), Yiddish and English, at `/he`, `/yi` and `/en`. Hebrew and
Yiddish render right-to-left. Interface text lives in `lib/i18n.ts`.

## Pages

| Route | What it is |
| --- | --- |
| `/[lang]` | Home: search, latest speeches, topics, lecturers, videos |
| `/[lang]/speeches` | Full speech directory, filtered by lecturer, topic, language, type |
| `/[lang]/speeches/[slug]` | A speech, with audio / video player and download |
| `/[lang]/lecturers` | Directory of all lecturers |
| `/[lang]/lecturers/[slug]` | A lecturer and all of their speeches |
| `/[lang]/resources` | Inspirational videos and the campaign video archive |
| `/[lang]/search` | Search across speeches, lecturers, topics and videos |
| `/[lang]/donate` | Donation form |

## Content

All content is in `content/*.json` and is **sample content** — replace it with
the real lecturers, speeches and videos.

- `lecturers.json`, `speeches.json`, `topics.json`, `videos.json`
- Give each speech / video a `src` (URL of the mp3 / mp4). Entries without one
  play the placeholder files in `public/media`.
- `site.json`: set `showDemoBanner` to `false` once real content is in, and
  set `donateUrl` (or the `NEXT_PUBLIC_DONATE_URL` environment variable) to the
  payment page. The donation form sends the donor there with `amount`,
  `currency`, `frequency`, `name`, `email`, `phone` and `dedication` as query
  parameters.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```
