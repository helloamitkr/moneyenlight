import { ALLOCATIONS, HORIZON_YEARS } from "./plan";

/**
 * The journey runs for HORIZON_YEARS * 12 months.
 * Month 0 = day the journey started (today). Month 1 = end of first month. etc.
 */
export const TOTAL_MONTHS = HORIZON_YEARS * 12;

/** Bucket id from plan.ts. */
export type BucketId = (typeof ALLOCATIONS)[number]["id"];

function allocById(id: BucketId) {
  const a = ALLOCATIONS.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown bucket: ${id}`);
  return a;
}

/** Cumulative amount invested in a single bucket by the end of month `m`. */
export function investedInBucketAtMonth(id: BucketId, m: number): number {
  const a = allocById(id);
  if (a.type === "lumpsum") return a.amount;
  return a.amount * m;
}

/** Cumulative amount invested across ALL buckets by the end of month `m`. */
export function investedAtMonth(m: number): number {
  return ALLOCATIONS.reduce(
    (s, a) => s + (a.type === "lumpsum" ? a.amount : a.amount * m),
    0
  );
}

/**
 * Real corpus snapshot at the end of a given month. Each entry holds the
 * *current value* of every bucket separately, so we can show per-bucket tabs.
 *
 * Update this every month after you record the YouTube video. Keep entries in
 * increasing month order.
 *
 * Tip: omit a bucket if you don't have a number yet — the table will fall back
 * to the previous known value.
 */
export interface CorpusSnapshot {
  month: number;
  values: Partial<Record<BucketId, number>>;
  note?: string;
}

/** Helper to seed a snapshot where every bucket equals its invested amount. */
function seedAt(month: number): Partial<Record<BucketId, number>> {
  const out: Partial<Record<BucketId, number>> = {};
  for (const a of ALLOCATIONS) {
    out[a.id] = investedInBucketAtMonth(a.id, month);
  }
  return out;
}

export const CORPUS_SNAPSHOTS: CorpusSnapshot[] = [
  { month: 0, values: seedAt(0), note: "Journey starts" },
];

/** Latest known corpus value for a single bucket at-or-before month `m`. */
export function bucketCorpusAt(id: BucketId, m: number): number | null {
  let latest: number | null = null;
  for (const s of CORPUS_SNAPSHOTS) {
    if (s.month > m) break;
    if (s.values[id] !== undefined) latest = s.values[id] as number;
  }
  return latest;
}

/** Latest known total corpus (sum of all buckets) at-or-before month `m`. */
export function totalCorpusAt(m: number): number | null {
  let total = 0;
  let any = false;
  for (const a of ALLOCATIONS) {
    const v = bucketCorpusAt(a.id, m);
    if (v === null) return null;
    total += v;
    any = true;
  }
  return any ? total : null;
}

/** Most recent snapshot month (used for "today" markers / hero stats). */
export function latestSnapshotMonth(): number {
  return CORPUS_SNAPSHOTS[CORPUS_SNAPSHOTS.length - 1].month;
}

/** Backwards-compatible helper used by the Hero. */
export function latestSnapshot(): { month: number; value: number } {
  const month = latestSnapshotMonth();
  return { month, value: totalCorpusAt(month) ?? investedAtMonth(month) };
}
