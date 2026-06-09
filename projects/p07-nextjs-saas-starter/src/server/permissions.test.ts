import { describe, it, expect } from "vitest";
import { atLeast, can, authorize, canActOnMember, ForbiddenError } from "./permissions.js";

describe("permissions", () => {
  it("ranks roles with atLeast", () => {
    expect(atLeast("owner", "admin")).toBe(true);
    expect(atLeast("member", "admin")).toBe(false);
    expect(atLeast("viewer", "viewer")).toBe(true);
  });

  it("gates actions by minimum role", () => {
    expect(can("owner", "org:delete")).toBe(true);
    expect(can("admin", "org:delete")).toBe(false);
    expect(can("admin", "member:invite")).toBe(true);
    expect(can("member", "project:create")).toBe(true);
    expect(can("viewer", "project:create")).toBe(false);
    expect(can("viewer", "project:view")).toBe(true);
  });

  it("authorize throws ForbiddenError when not allowed", () => {
    expect(() => authorize("member", "billing:manage")).toThrow(ForbiddenError);
    expect(() => authorize("owner", "billing:manage")).not.toThrow();
  });

  it("canActOnMember requires strictly higher rank", () => {
    expect(canActOnMember("owner", "admin")).toBe(true);
    expect(canActOnMember("admin", "admin")).toBe(false); // equal rank → no
    expect(canActOnMember("admin", "member")).toBe(true);
    expect(canActOnMember("member", "admin")).toBe(false);
  });
});
