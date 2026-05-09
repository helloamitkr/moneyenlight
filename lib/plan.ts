import { lumpsumFV, sipFV } from "./finance";

// The user's actual plan. Tweak these freely.
export interface Allocation {
  id: string;
  label: string;
  amount: number;
  type: "lumpsum" | "monthly" | "reserve";
  expectedReturn: number; // % p.a.
  note: string;
  accent: string; // tailwind color class fragment
}

export const HORIZON_YEARS = 12;

export const ALLOCATIONS: Allocation[] = [
  {
    id: "sip",
    label: "Mutual Fund SIP",
    amount: 20_000,
    type: "monthly",
    expectedReturn: 12,
    note: "₹20,000 every month into a diversified equity mutual fund. The core wealth-builder.",
    accent: "from-emerald-400/30 to-emerald-600/10 border-emerald-400/30",
  },
  {
    id: "stock",
    label: "Direct Stocks (Long-term)",
    amount: 6_000,
    type: "monthly",
    expectedReturn: 14,
    note: "₹6,000 every month into quality stocks held for the long term.",
    accent: "from-violet-400/30 to-violet-600/10 border-violet-400/30",
  },
  {
    id: "reserve",
    label: "Market-Dip Reserve",
    amount: 3_000,
    type: "monthly",
    expectedReturn: 6,
    note: "₹3,000 every month set aside to deploy when the market falls. Dry powder.",
    accent: "from-amber-400/30 to-amber-600/10 border-amber-400/30",
  },
  {
    id: "swing",
    label: "Swing Trading Capital",
    amount: 1_00_000,
    type: "lumpsum",
    expectedReturn: 18,
    note: "₹1,00,000 one-time capital for short-term swing trades. Higher risk, strict stop-loss.",
    accent: "from-sky-400/30 to-sky-600/10 border-sky-400/30",
  },
];

export interface AllocationProjection extends Allocation {
  invested: number;
  futureValue: number;
}

export function projectAllocations(years = HORIZON_YEARS): AllocationProjection[] {
  return ALLOCATIONS.map((a) => {
    if (a.type === "monthly") {
      return {
        ...a,
        invested: a.amount * 12 * years,
        futureValue: sipFV(a.amount, a.expectedReturn, years),
      };
    }
    // lumpsum & reserve both compound as one-time deposits
    return {
      ...a,
      invested: a.amount,
      futureValue: lumpsumFV(a.amount, a.expectedReturn, years),
    };
  });
}

export function totals(years = HORIZON_YEARS) {
  const rows = projectAllocations(years);
  return rows.reduce(
    (acc, r) => {
      acc.invested += r.invested;
      acc.futureValue += r.futureValue;
      return acc;
    },
    { invested: 0, futureValue: 0 }
  );
}
