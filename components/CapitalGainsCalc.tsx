"use client";

import { useState } from "react";
import { formatINR, formatINRWords } from "@/lib/finance";

type AssetType = "equity" | "debt" | "property";

const ASSETS: { id: AssetType; label: string; ltcgMonths: number }[] = [
  { id: "equity", label: "Equity / Equity MF", ltcgMonths: 12 },
  { id: "debt", label: "Debt MF", ltcgMonths: 0 },          // always slab
  { id: "property", label: "Property / Gold", ltcgMonths: 24 },
];

// Budget 2024 rates (effective 23 Jul 2024)
const EQUITY_STCG_RATE = 20;
const EQUITY_LTCG_RATE = 12.5;
const EQUITY_LTCG_EXEMPT = 125000; // ₹1.25 lakh per FY
const PROPERTY_LTCG_RATE = 12.5;

const SLAB_RATES = [
  { upto: 300000, rate: 0 },
  { upto: 700000, rate: 5 },
  { upto: 1000000, rate: 10 },
  { upto: 1200000, rate: 15 },
  { upto: 1500000, rate: 20 },
  { upto: Infinity, rate: 30 },
];

function slabTax(taxableIncome: number, gain: number): number {
  // simplified: tax only on the capital gain portion at marginal slab
  // For accuracy, user would need to input total income; this uses gain-only approximation
  let remaining = gain;
  let tax = 0;
  let prev = 0;
  for (const s of SLAB_RATES) {
    if (remaining <= 0) break;
    const bracket = s.upto - prev;
    const chunk = Math.min(remaining, bracket);
    tax += chunk * (s.rate / 100);
    remaining -= chunk;
    prev = s.upto;
  }
  return Math.round(tax);
}

interface TaxResult {
  gain: number;
  taxType: "STCG" | "LTCG" | "Slab Rate";
  rate: string;
  exempt: number;
  taxableGain: number;
  tax: number;
  cess: number;
  totalTax: number;
  netProfit: number;
}

function computeTax(
  asset: AssetType,
  buyPrice: number,
  sellPrice: number,
  months: number,
): TaxResult {
  const gain = sellPrice - buyPrice;
  const info = ASSETS.find((a) => a.id === asset)!;

  // Debt MF (post April 2023) — always slab rate
  if (asset === "debt") {
    const tax = gain > 0 ? slabTax(0, gain) : 0;
    const cess = Math.round(tax * 0.04);
    return {
      gain,
      taxType: "Slab Rate",
      rate: "As per slab",
      exempt: 0,
      taxableGain: Math.max(gain, 0),
      tax,
      cess,
      totalTax: tax + cess,
      netProfit: gain - tax - cess,
    };
  }

  const isLong = months >= info.ltcgMonths;

  if (asset === "equity") {
    if (isLong) {
      const exempt = EQUITY_LTCG_EXEMPT;
      const taxableGain = Math.max(gain - exempt, 0);
      const tax = Math.round(taxableGain * (EQUITY_LTCG_RATE / 100));
      const cess = Math.round(tax * 0.04);
      return {
        gain,
        taxType: "LTCG",
        rate: `${EQUITY_LTCG_RATE}%`,
        exempt,
        taxableGain,
        tax,
        cess,
        totalTax: tax + cess,
        netProfit: gain - tax - cess,
      };
    } else {
      const taxableGain = Math.max(gain, 0);
      const tax = Math.round(taxableGain * (EQUITY_STCG_RATE / 100));
      const cess = Math.round(tax * 0.04);
      return {
        gain,
        taxType: "STCG",
        rate: `${EQUITY_STCG_RATE}%`,
        exempt: 0,
        taxableGain,
        tax,
        cess,
        totalTax: tax + cess,
        netProfit: gain - tax - cess,
      };
    }
  }

  // Property / Gold
  if (isLong) {
    const taxableGain = Math.max(gain, 0);
    const tax = Math.round(taxableGain * (PROPERTY_LTCG_RATE / 100));
    const cess = Math.round(tax * 0.04);
    return {
      gain,
      taxType: "LTCG",
      rate: `${PROPERTY_LTCG_RATE}%`,
      exempt: 0,
      taxableGain,
      tax,
      cess,
      totalTax: tax + cess,
      netProfit: gain - tax - cess,
    };
  } else {
    const tax = gain > 0 ? slabTax(0, gain) : 0;
    const cess = Math.round(tax * 0.04);
    return {
      gain,
      taxType: "STCG",
      rate: "As per slab",
      exempt: 0,
      taxableGain: Math.max(gain, 0),
      tax,
      cess,
      totalTax: tax + cess,
      netProfit: gain - tax - cess,
    };
  }
}

export default function CapitalGainsCalc() {
  const [asset, setAsset] = useState<AssetType>("equity");
  const [buyPrice, setBuyPrice] = useState(100000);
  const [sellPrice, setSellPrice] = useState(200000);
  const [months, setMonths] = useState(14);

  const result = computeTax(asset, buyPrice, sellPrice, months);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      {/* Asset type tabs */}
      <div role="tablist" className="flex border-b border-white/10">
        {ASSETS.map((a) => {
          const active = a.id === asset;
          return (
            <button
              key={a.id}
              role="tab"
              aria-selected={active}
              onClick={() => setAsset(a.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border-b-2 border-brand-400 text-white"
                  : "border-b-2 border-transparent text-white/55 hover:text-white"
              }`}
            >
              {a.label}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        <Field label="Buy price (₹)" value={buyPrice} onChange={setBuyPrice} step={1000} min={0} />
        <Field label="Sell price (₹)" value={sellPrice} onChange={setSellPrice} step={1000} min={0} />
        <Field label="Holding period (months)" value={months} onChange={setMonths} step={1} min={1} max={600} />

        {/* Classification badge */}
        <div className="mb-4 mt-6 flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              result.taxType === "LTCG"
                ? "bg-emerald-500/20 text-emerald-400"
                : result.taxType === "STCG"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {result.taxType}
          </span>
          <span className="text-sm text-white/60">Tax rate: {result.rate}</span>
          {result.exempt > 0 && (
            <span className="text-sm text-white/60">
              (₹{(result.exempt / 100000).toFixed(2)} L exempt)
            </span>
          )}
        </div>

        {/* Primary result */}
        <div className="rounded-lg border border-white/10 bg-black/30 px-5 py-6 text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Total tax payable</div>
          <div className="mt-2 text-4xl font-extrabold tracking-tight text-brand-400 md:text-5xl">
            {formatINR(result.totalTax)}
          </div>
          <div className="mt-2 text-sm capitalize text-white/55">{formatINRWords(result.totalTax)}</div>
        </div>

        {/* Detail rows */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <InfoBox label="Capital Gain" value={result.gain} />
          <InfoBox label="Taxable Gain" value={result.taxableGain} />
          <InfoBox label="Tax (before cess)" value={result.tax} />
          <InfoBox label="Cess (4%)" value={result.cess} />
          <div className="col-span-2">
            <InfoBox label="Net Profit (after tax)" value={result.netProfit} highlight />
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-5 text-[11px] leading-relaxed text-white/40">
          Based on Union Budget 2024 rates. Equity LTCG exempt up to ₹1.25 L/FY. Debt MF (post Apr 2023) taxed at slab.
          4% health &amp; education cess included. Surcharge not included. This is indicative — consult a CA for exact liability.
        </p>
      </div>
    </div>
  );
}

/* ----------------------------- Shared UI ----------------------------- */
function Field({
  label,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <label className="mb-4 block">
      <div className="mb-1.5 text-sm text-white/70">{label}</div>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2.5 text-base tabular-nums text-white outline-none focus:border-brand-400"
      />
    </label>
  );
}

function InfoBox({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-white/50">{label}</div>
      <div
        className={`mt-0.5 text-lg font-semibold tabular-nums ${
          highlight ? "text-brand-400" : "text-white"
        }`}
      >
        {formatINR(value)}
      </div>
      <div className="mt-0.5 text-[11px] capitalize text-white/45">{formatINRWords(value)}</div>
    </div>
  );
}
