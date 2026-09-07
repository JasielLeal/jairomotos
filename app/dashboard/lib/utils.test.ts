import { describe, expect, it } from "vitest";
import { monthBuckets, pctChange, sumByType, formatCompactBRL } from "@/app/dashboard/lib/utils";

describe("monthBuckets", () => {
  it("returns the requested number of buckets ending on the reference month", () => {
    const buckets = monthBuckets(3, new Date(2026, 8, 15));
    expect(buckets).toHaveLength(3);
    expect(buckets[2]).toMatchObject({ year: 2026, month: 8 });
    expect(buckets[0]).toMatchObject({ year: 2026, month: 6 });
  });

  it("rolls over to the previous year", () => {
    const buckets = monthBuckets(3, new Date(2026, 0, 15));
    expect(buckets[0]).toMatchObject({ year: 2025, month: 10 });
  });
});

describe("pctChange", () => {
  it("computes percentage change", () => {
    expect(pctChange(150, 100)).toBe(50);
    expect(pctChange(50, 100)).toBe(-50);
  });

  it("returns 0 when both current and previous are 0", () => {
    expect(pctChange(0, 0)).toBe(0);
  });

  it("returns null when previous is 0 but current is not", () => {
    expect(pctChange(100, 0)).toBeNull();
  });
});

describe("sumByType", () => {
  const txs = [
    { type: "RECEITA", amountCents: 1000 },
    { type: "DESPESA", amountCents: 300 },
    { type: "RECEITA", amountCents: 500 },
  ];

  it("sums only transactions matching the given type", () => {
    expect(sumByType(txs, "RECEITA")).toBe(1500);
    expect(sumByType(txs, "DESPESA")).toBe(300);
  });

  it("returns 0 when there are no matches", () => {
    expect(sumByType([], "RECEITA")).toBe(0);
  });
});

describe("formatCompactBRL", () => {
  it("formats small values as whole reais", () => {
    expect(formatCompactBRL(50000)).toBe("R$500");
  });

  it("formats thousands with a k suffix", () => {
    expect(formatCompactBRL(150_000_00)).toBe("R$150.0k");
  });

  it("formats millions with an M suffix", () => {
    expect(formatCompactBRL(2_500_000_00)).toBe("R$2.5M");
  });
});
