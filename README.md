# MoneyEnlight

Companion site for the **MoneyEnlight YouTube channel** — a documented **12-year smart investing journey**, plus interactive **SIP & Lumpsum calculators** for viewers.

## What's on the site

- **Home** — hero, latest updates, allocation, 12-year projection chart, milestone timeline
- **`/updates`** — chronological journey log (markdown-driven), each entry can embed a YouTube video and a portfolio snapshot
- **`/updates/[slug]`** — full post with embedded video, snapshot, and rendered markdown body
- **`/calculators`** — SIP & Lumpsum calculators with live charts

## The plan featured on the site

| Bucket | Amount | Type | Expected return |
|---|---|---|---|
| Mutual Fund | ₹20,000 | Lumpsum | 12% p.a. |
| Swing Trading capital | ₹1,00,000 | Lumpsum | 18% p.a. |
| Direct Stocks (long-term) | ₹6,000 | Lumpsum | 14% p.a. |
| Market-dip reserve | ₹3,000 | Reserve | 6% p.a. |
| Monthly SIP | ₹5,000 / month | Monthly | 12% p.a. |

Tweak the values in `lib/plan.ts` — every page, chart and milestone updates automatically.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling, **Lucide** icons
- **Recharts** for growth charts
- **gray-matter + marked** for markdown-driven journey log
- Pure-function finance helpers in `lib/finance.ts`

## Two files you edit most

| File | What it controls |
|---|---|
| `lib/site.ts` | Channel name, handle, URL, tagline (used everywhere) |
| `lib/plan.ts` | The 5 buckets, amounts, expected returns, horizon |
| `content/updates/*.md` | Each new journey update / episode |

See `content/README.md` for the markdown frontmatter format.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.tsx               # site shell (header w/ Subscribe CTA, footer)
  page.tsx                 # landing — hero, latest updates, allocation, journey
  calculators/page.tsx     # SIP + Lumpsum calculators
  updates/page.tsx         # journey log (newest first)
  updates/[slug]/page.tsx  # individual update / episode
  globals.css
components/
  Hero.tsx
  AllocationGrid.tsx
  JourneyChart.tsx         # 12-year area chart of full plan
  Timeline.tsx             # year-1/3/5/8/12 milestones
  SipCalculator.tsx
  LumpsumCalculator.tsx
  UpdateCard.tsx
  YouTubeEmbed.tsx
content/
  updates/*.md             # one file per update/episode
  README.md                # how to add new updates
lib/
  site.ts                  # channel/site identity (edit me)
  plan.ts                  # the actual plan + projections (edit me)
  finance.ts               # FV, SIP/lumpsum formulas, INR formatters
  updates.ts               # markdown reader
```

## Disclaimer

Educational content only. Not financial advice. Past performance does not guarantee future returns.
