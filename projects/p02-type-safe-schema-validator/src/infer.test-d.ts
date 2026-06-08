/**
 * TYPE-LEVEL tests. These assert that the compile-time inference is correct.
 * Run with `pnpm test:types` (vitest --typecheck) — failures are TYPE errors,
 * caught by the compiler, never at runtime. This is the proof that one schema
 * declaration yields the exact right static type.
 */
import { describe, it, expectTypeOf } from "vitest";
import { v } from "./index.js";
import type { Infer } from "./index.js";

describe("inference", () => {
  it("infers primitives", () => {
    expectTypeOf<Infer<ReturnType<typeof v.string>>>().toEqualTypeOf<string>();
    expectTypeOf<Infer<ReturnType<typeof v.number>>>().toEqualTypeOf<number>();
    expectTypeOf<Infer<ReturnType<typeof v.boolean>>>().toEqualTypeOf<boolean>();
  });

  it("infers literals narrowly via const type params", () => {
    const admin = v.literal("admin");
    expectTypeOf<Infer<typeof admin>>().toEqualTypeOf<"admin">();
  });

  it("infers arrays", () => {
    const nums = v.array(v.number());
    expectTypeOf<Infer<typeof nums>>().toEqualTypeOf<number[]>();
  });

  it("infers objects with required and optional keys", () => {
    const User = v.object({
      id: v.number(),
      name: v.string(),
      bio: v.string().optional(),
    });
    type User = Infer<typeof User>;
    expectTypeOf<User>().toEqualTypeOf<{ id: number; name: string; bio?: string }>();
  });

  it("infers unions as a union type", () => {
    const Role = v.union(v.literal("admin"), v.literal("user"));
    expectTypeOf<Infer<typeof Role>>().toEqualTypeOf<"admin" | "user">();
  });

  it("infers deeply nested shapes", () => {
    const Team = v.object({
      name: v.string(),
      members: v.array(v.object({ name: v.string(), age: v.number() })),
      lead: v.object({ name: v.string() }).nullable(),
    });
    type Team = Infer<typeof Team>;
    expectTypeOf<Team>().toEqualTypeOf<{
      name: string;
      members: { name: string; age: number }[];
      lead: { name: string } | null;
    }>();
  });
});
