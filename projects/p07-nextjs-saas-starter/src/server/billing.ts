/**
 * Billing rules: plan limits, seat/project gating, and proration math.
 * Pure functions — the kind of business logic that MUST be correct and is a
 * joy to test (no money bugs allowed).
 */
export type Plan = "free" | "pro" | "enterprise";

export interface PlanLimits {
  readonly maxSeats: number;
  readonly maxProjects: number;
  /** Price per seat per month, in cents. */
  readonly seatPriceCents: number;
}

const LIMITS: Record<Plan, PlanLimits> = {
  free: { maxSeats: 3, maxProjects: 2, seatPriceCents: 0 },
  pro: { maxSeats: 25, maxProjects: 50, seatPriceCents: 1500 },
  enterprise: { maxSeats: Infinity, maxProjects: Infinity, seatPriceCents: 4000 },
};

export function planLimits(plan: Plan): PlanLimits {
  return LIMITS[plan];
}

export function canAddSeat(plan: Plan, currentSeats: number): boolean {
  return currentSeats < LIMITS[plan].maxSeats;
}

export function canAddProject(plan: Plan, currentProjects: number): boolean {
  return currentProjects < LIMITS[plan].maxProjects;
}

/** Monthly cost in cents for a given seat count on a plan. */
export function monthlyCostCents(plan: Plan, seats: number): number {
  if (seats < 0) throw new Error("seats must be >= 0");
  return Math.round(seats * LIMITS[plan].seatPriceCents);
}

/**
 * Proration for adding seats mid-cycle: charge only for the remaining days.
 * Returns cents, rounded to the nearest cent.
 */
export function prorateAddSeatsCents(
  plan: Plan,
  addedSeats: number,
  daysRemaining: number,
  daysInCycle = 30,
): number {
  if (addedSeats < 0 || daysRemaining < 0) throw new Error("inputs must be >= 0");
  const fraction = Math.min(daysRemaining, daysInCycle) / daysInCycle;
  return Math.round(addedSeats * LIMITS[plan].seatPriceCents * fraction);
}

/** Is a plan change an upgrade (more expensive seat price)? */
export function isUpgrade(from: Plan, to: Plan): boolean {
  return LIMITS[to].seatPriceCents > LIMITS[from].seatPriceCents;
}
