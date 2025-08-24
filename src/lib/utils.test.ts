import { describe, it, expect } from "vitest";
import { calcIncentivesTotal, INR } from "./utils";

describe("utils", () => {
  it("calcIncentivesTotal sums qty*unit*rate", () => {
    const sales = [
      { id: "1", billNo: "b1", date: "2025-01-01", execId: "E1", branchId: "B", item: "x", sku: "sx", qty: 2, unitPrice: 100 },
      { id: "2", billNo: "b2", date: "2025-01-02", execId: "E2", branchId: "B", item: "y", sku: "sy", qty: 1, unitPrice: 200 }
    ];
    const execs = [
      { id: "E1", name: "A", branchId: "B", joinedOn: "2025-01-01", targetMonthly: 0, incentivePct: 10 },
      { id: "E2", name: "B", branchId: "B", joinedOn: "2025-01-01", targetMonthly: 0, incentivePct: 5 }
    ] as any;
    expect(calcIncentivesTotal(sales as any, execs)).toBeCloseTo(2*100*0.10 + 1*200*0.05);
  });
  it("INR formats rupees", () => {
    expect(INR(1234)).toMatch(/₹/);
  });
});
