import { describe, it, expect } from "vitest";
import {
  planLimits,
  canAddSeat,
  canAddProject,
  monthlyCostCents,
  prorateAddSeatsCents,
  isUpgrade,
} from "./billing.js";

describe("billing", () => {
  it("exposes plan limits", () => {
    expect(planLimits("free").maxProjects).toBe(2);
    expect(planLimits("pro").seatPriceCents).toBe(1500);
    expect(planLimits("enterprise").maxSeats).toBe(Infinity);
  });

  it("gates seats and projects by plan", () => {
    expect(canAddSeat("free", 2)).toBe(true);
    expect(canAddSeat("free", 3)).toBe(false); // at the limit
    expect(canAddProject("pro", 49)).toBe(true);
    expect(canAddProject("pro", 50)).toBe(false);
    expect(canAddSeat("enterprise", 9999)).toBe(true); // unlimited
  });

  it("computes monthly cost", () => {
    expect(monthlyCostCents("pro", 10)).toBe(15000);
    expect(monthlyCostCents("free", 3)).toBe(0);
    expect(() => monthlyCostCents("pro", -1)).toThrow();
  });

  it("prorates added seats by remaining days", () => {
    // pro seat = 1500c; 2 seats for half a 30-day cycle = 2*1500*0.5 = 1500
    expect(prorateAddSeatsCents("pro", 2, 15)).toBe(1500);
    expect(prorateAddSeatsCents("pro", 1, 0)).toBe(0);
    expect(prorateAddSeatsCents("pro", 1, 30)).toBe(1500); // full cycle
    expect(prorateAddSeatsCents("pro", 1, 45)).toBe(1500); // capped at cycle
  });

  it("detects upgrades", () => {
    expect(isUpgrade("free", "pro")).toBe(true);
    expect(isUpgrade("pro", "free")).toBe(false);
    expect(isUpgrade("pro", "enterprise")).toBe(true);
  });
});
