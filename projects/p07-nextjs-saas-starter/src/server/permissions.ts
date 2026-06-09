/**
 * Role-based access control for the SaaS. Pure functions — the security rules
 * that every Server Action / tRPC procedure consults. Trivially unit-testable.
 */
export type Role = "owner" | "admin" | "member" | "viewer";

/** Higher rank = more privileged. Used for "at least this role" checks. */
const RANK: Record<Role, number> = { owner: 3, admin: 2, member: 1, viewer: 0 };

export type Action =
  | "org:delete"
  | "billing:manage"
  | "member:invite"
  | "member:remove"
  | "project:create"
  | "project:edit"
  | "project:view";

/** The minimum role required to perform each action. */
const REQUIRED: Record<Action, Role> = {
  "org:delete": "owner",
  "billing:manage": "owner",
  "member:invite": "admin",
  "member:remove": "admin",
  "project:create": "member",
  "project:edit": "member",
  "project:view": "viewer",
};

/** Does this role meet or exceed the required role? */
export function atLeast(role: Role, min: Role): boolean {
  return RANK[role] >= RANK[min];
}

/** Is this role allowed to perform this action? */
export function can(role: Role, action: Action): boolean {
  return atLeast(role, REQUIRED[action]);
}

export class ForbiddenError extends Error {
  constructor(action: Action) {
    super(`Forbidden: this role cannot perform "${action}"`);
    this.name = "ForbiddenError";
  }
}

/** Assert a role can perform an action, or throw. */
export function authorize(role: Role, action: Action): void {
  if (!can(role, action)) throw new ForbiddenError(action);
}

/**
 * Can `actor` modify `target`? You may never act on someone of equal-or-higher
 * rank than yourself (e.g. an admin can't remove an owner or another admin).
 */
export function canActOnMember(actorRole: Role, targetRole: Role): boolean {
  return RANK[actorRole] > RANK[targetRole];
}
