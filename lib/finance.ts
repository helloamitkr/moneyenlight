// Pure finance helpers used by both calculators and the journey projection.

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

export const formatINRCompact = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)} K`;
  return `₹${Math.round(n)}`;
};

/**
 * Convert a non-negative number to its Indian-numbering English words.
 * Uses lakh / crore. Rounds to the nearest rupee.
 *
 *   100000   -> "one lakh"
 *   1160000  -> "eleven lakh sixty thousand"
 *   65500000 -> "six crore fifty-five lakh"
 */
export function numberToIndianWords(input: number): string {
  const n = Math.round(Math.abs(input));
  if (n === 0) return "zero";

  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen",
  ];
  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  ];

  const twoDigit = (x: number): string => {
    if (x < 20) return ones[x];
    const t = Math.floor(x / 10);
    const o = x % 10;
    return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
  };

  const threeDigit = (x: number): string => {
    const h = Math.floor(x / 100);
    const r = x % 100;
    if (h === 0) return twoDigit(r);
    if (r === 0) return `${ones[h]} hundred`;
    return `${ones[h]} hundred ${twoDigit(r)}`;
  };

  const parts: string[] = [];
  const crore = Math.floor(n / 1e7);
  let rest = n % 1e7;
  const lakh = Math.floor(rest / 1e5);
  rest = rest % 1e5;
  const thousand = Math.floor(rest / 1e3);
  rest = rest % 1e3;

  if (crore) parts.push(`${twoDigit(crore)} crore`);
  if (lakh) parts.push(`${twoDigit(lakh)} lakh`);
  if (thousand) parts.push(`${twoDigit(thousand)} thousand`);
  if (rest) parts.push(threeDigit(rest));

  const sign = input < 0 ? "minus " : "";
  return sign + parts.join(" ");
}

/** Words form suffixed with "rupees", e.g. "One Lakh Rupees". */
export const formatINRWords = (n: number) => `${numberToIndianWords(n)} rupees`;

/** Future value of a one-time lumpsum at annual rate `r` (in %) for `years`. */
export function lumpsumFV(principal: number, ratePct: number, years: number): number {
  const r = ratePct / 100;
  return principal * Math.pow(1 + r, years);
}

/**
 * Future value of a monthly SIP. Standard formula:
 *   FV = P * [((1 + i)^n - 1) / i] * (1 + i)
 * where i = monthly rate, n = months.
 */
export function sipFV(monthly: number, ratePct: number, years: number): number {
  const i = ratePct / 100 / 12;
  const n = years * 12;
  if (i === 0) return monthly * n;
  return monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
}

/**
 * Future value of a step-up SIP. The monthly contribution increases by
 * `stepUpPct` % at the end of every 12 months. Simulated month-by-month
 * with end-of-month deposit + monthly compounding.
 */
export function sipFVStepUp(
  monthly: number,
  ratePct: number,
  years: number,
  stepUpPct: number
): number {
  if (stepUpPct === 0) return sipFV(monthly, ratePct, years);
  const i = ratePct / 100 / 12;
  const step = stepUpPct / 100;
  const n = years * 12;
  let balance = 0;
  let m = monthly;
  for (let k = 1; k <= n; k++) {
    balance = balance * (1 + i) + m;
    if (k % 12 === 0) m *= 1 + step;
  }
  return balance;
}

/** Total amount invested over the years for a step-up SIP. */
export function sipInvestedStepUp(
  monthly: number,
  years: number,
  stepUpPct: number
): number {
  if (stepUpPct === 0) return monthly * 12 * years;
  const step = stepUpPct / 100;
  let total = 0;
  let m = monthly;
  for (let y = 0; y < years; y++) {
    total += m * 12;
    m *= 1 + step;
  }
  return total;
}

/**
 * Equated Monthly Installment (EMI).
 *   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where r = monthly rate, n = total months.
 */
export function emi(principal: number, ratePct: number, years: number): number {
  const r = ratePct / 100 / 12;
  const n = years * 12;
  if (n === 0) return 0;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return (principal * r * pow) / (pow - 1);
}
