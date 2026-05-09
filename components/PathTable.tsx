"use client";

import { useState } from "react";
import { formatINR, formatINRCompact } from "@/lib/finance";
import { HORIZON_YEARS } from "@/lib/plan";
import {
  bucketCorpusAt,
  investedInBucketAtMonth,
  latestSnapshotMonth,
  type BucketId,
} from "@/lib/progress";

interface Tab {
  id: BucketId;
  label: string;
  blurb: string;
}

const TABS: Tab[] = [
  { id: "sip", label: "Mutual Fund", blurb: "₹20,000 every month into a diversified equity SIP." },
  { id: "swing", label: "Swing Trading", blurb: "₹1,00,000 one-time capital, actively traded with strict stop-loss." },
  { id: "stock", label: "Long-term Stocks", blurb: "₹6,000 every month into hand-picked quality stocks." },
];

export default function PathTable() {
  const [active, setActive] = useState<BucketId>("sip");
  const lastMonth = latestSnapshotMonth();
  const tab = TABS.find((t) => t.id === active)!;

  const rows = Array.from({ length: HORIZON_YEARS + 1 }, (_, y) => {
    const month = y * 12;
    const invested = investedInBucketAtMonth(active, month);
    const reached = month <= lastMonth;
    const corpus = reached ? bucketCorpusAt(active, month) : null;
    const gain = corpus !== null ? corpus - invested : null;
    return { year: y, month, invested, corpus, gain, reached };
  });

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 px-5 py-4">
        <h3 className="text-lg font-semibold">Year-by-year path</h3>
        <span className="text-xs text-white/50">
          Reached: Year {Math.floor(lastMonth / 12)} · Month {lastMonth}
        </span>
      </div>

      <div role="tablist" className="flex border-b border-white/10">
        {TABS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-b-2 border-brand-400 text-white"
                  : "border-b-2 border-transparent text-white/55 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <p className="border-b border-white/5 px-5 py-3 text-sm text-white/60">{tab.blurb}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-white/50">
              <th className="px-5 py-3 font-medium">Year</th>
              <th className="px-5 py-3 font-medium">Invested</th>
              <th className="px-5 py-3 font-medium">Current corpus</th>
              <th className="px-5 py-3 font-medium">Gain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.year} className={r.reached ? "" : "text-white/40"}>
                <td className="px-5 py-3">
                  <span className="font-medium">Y{r.year}</span>
                  <span className="ml-2 text-xs text-white/40">m{r.month}</span>
                </td>
                <td className="px-5 py-3 tabular-nums">{formatINR(r.invested)}</td>
                <td className="px-5 py-3 tabular-nums">
                  {r.corpus !== null ? (
                    <span className="font-semibold text-brand-400">{formatINR(r.corpus)}</span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="px-5 py-3 tabular-nums">
                  {r.gain !== null ? (
                    <span className={r.gain >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {r.gain >= 0 ? "+" : ""}
                      {formatINRCompact(r.gain)}
                    </span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-white/5 px-5 py-3 text-xs text-white/45">
        Greyed-out years are still in the future. Corpus and gain fill in as real numbers come in each month.
      </p>
    </div>
  );
}
