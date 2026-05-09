"use client";

import { useState } from "react";
import {
  emi,
  formatINR,
  formatINRWords,
  lumpsumFV,
  sipFVStepUp,
  sipInvestedStepUp,
} from "@/lib/finance";

type TabId = "sip" | "lumpsum" | "emi";

const TABS: { id: TabId; label: string }[] = [
  { id: "sip", label: "SIP" },
  { id: "lumpsum", label: "Lumpsum" },
  { id: "emi", label: "EMI" },
];

export default function Calculators() {
  const [tab, setTab] = useState<TabId>("sip");

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div role="tablist" className="flex border-b border-white/10">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border-b-2 border-brand-400 text-white"
                  : "border-b-2 border-transparent text-white/55 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        {tab === "sip" && <SipPanel />}
        {tab === "lumpsum" && <LumpsumPanel />}
        {tab === "emi" && <EmiPanel />}
      </div>
    </div>
  );
}

/* ------------------------------ SIP ------------------------------ */
function SipPanel() {
  const [monthly, setMonthly] = useState(20000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(12);
  const [stepUpOn, setStepUpOn] = useState(false);
  const [stepUp, setStepUp] = useState(10);

  const effectiveStep = stepUpOn ? stepUp : 0;
  const fv = sipFVStepUp(monthly, rate, years, effectiveStep);
  const invested = sipInvestedStepUp(monthly, years, effectiveStep);
  const gain = fv - invested;

  return (
    <>
      <Field label="Monthly investment (₹)" value={monthly} onChange={setMonthly} step={500} min={500} />
      <Field label="Expected return (% p.a.)" value={rate} onChange={setRate} step={0.5} min={0} max={30} />
      <Field label="Years" value={years} onChange={setYears} step={1} min={1} max={40} />

      <label className="mb-3 mt-1 flex cursor-pointer items-center gap-2 text-sm text-white/75">
        <input
          type="checkbox"
          checked={stepUpOn}
          onChange={(e) => setStepUpOn(e.target.checked)}
          className="h-4 w-4 accent-brand-500"
        />
        Step up SIP yearly
      </label>
      {stepUpOn ? (
        <Field label="Yearly step-up (%)" value={stepUp} onChange={setStepUp} step={1} min={0} max={50} />
      ) : null}

      <Result primary={fv} primaryLabel="Future value" />
      <SubRow left={["Invested", invested]} right={["Wealth gained", gain]} />
    </>
  );
}

/* ---------------------------- Lumpsum ---------------------------- */
function LumpsumPanel() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(12);

  const fv = lumpsumFV(amount, rate, years);
  const gain = fv - amount;

  return (
    <>
      <Field label="Investment amount (₹)" value={amount} onChange={setAmount} step={1000} min={1000} />
      <Field label="Expected return (% p.a.)" value={rate} onChange={setRate} step={0.5} min={0} max={30} />
      <Field label="Years" value={years} onChange={setYears} step={1} min={1} max={40} />

      <Result primary={fv} primaryLabel="Future value" />
      <SubRow left={["Invested", amount]} right={["Wealth gained", gain]} />
    </>
  );
}

/* ------------------------------ EMI ------------------------------ */
function EmiPanel() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const monthlyEmi = emi(principal, rate, years);
  const total = monthlyEmi * years * 12;
  const interest = total - principal;

  return (
    <>
      <Field label="Loan amount (₹)" value={principal} onChange={setPrincipal} step={10000} min={10000} />
      <Field label="Interest rate (% p.a.)" value={rate} onChange={setRate} step={0.1} min={0} max={30} />
      <Field label="Tenure (years)" value={years} onChange={setYears} step={1} min={1} max={30} />

      <Result primary={monthlyEmi} primaryLabel="Monthly EMI" />
      <SubRow left={["Total interest", interest]} right={["Total payment", total]} />
    </>
  );
}

/* --------------------------- Shared UI --------------------------- */
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

function Result({ primary, primaryLabel }: { primary: number; primaryLabel: string }) {
  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-black/30 px-5 py-6 text-center">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">{primaryLabel}</div>
      <div className="mt-2 text-4xl font-extrabold tracking-tight text-brand-400 md:text-5xl">
        {formatINR(primary)}
      </div>
      <div className="mt-2 text-sm capitalize text-white/55">{formatINRWords(primary)}</div>
    </div>
  );
}

function SubRow({
  left,
  right,
}: {
  left: [string, number];
  right: [string, number];
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <Sub label={left[0]} value={left[1]} />
      <Sub label={right[0]} value={right[1]} />
    </div>
  );
}

function Sub({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-white/50">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-white">
        {formatINR(value)}
      </div>
      <div className="mt-0.5 text-[11px] capitalize text-white/45">{formatINRWords(value)}</div>
    </div>
  );
}
