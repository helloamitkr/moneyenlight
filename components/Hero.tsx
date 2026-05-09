import Link from "next/link";
import { Youtube } from "lucide-react";
import { formatINR, formatINRCompact } from "@/lib/finance";
import { ALLOCATIONS, HORIZON_YEARS } from "@/lib/plan";
import { investedAtMonth, latestSnapshot } from "@/lib/progress";
import { site } from "@/lib/site";

export default function Hero() {
  const monthly = ALLOCATIONS.filter((a) => a.type === "monthly").reduce(
    (s, a) => s + a.amount,
    0
  );
  const snap = latestSnapshot();
  const invested = investedAtMonth(snap.month);

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-5xl px-4 pb-14 pt-14 md:pt-20">
        <div className="text-xs uppercase tracking-[0.18em] text-white/50">
          {site.name} · a {HORIZON_YEARS}-year journey
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          I'm investing <span className="text-brand-400">{formatINR(monthly)}</span> every month for {HORIZON_YEARS} years.
          <br className="hidden md:inline" />
          <span className="text-white/60">How much do you think it will become?</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/65">
          No projections. No guesses. Just the real journey — documented every month on YouTube. The corpus line on this page grows only when actual results come in.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={site.youtube.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500"
          >
            <Youtube className="h-4 w-4" /> Follow on YouTube
          </a>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Calculators
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Stat label="Invested so far" value={formatINRCompact(invested)} />
          <Stat label="Current corpus" value={formatINRCompact(snap.value)} accent />
          <Stat label="Months in" value={`${snap.month} / ${HORIZON_YEARS * 12}`} />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-white/50">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${accent ? "text-brand-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
