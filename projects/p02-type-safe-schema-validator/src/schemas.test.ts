import { describe, it, expect } from "vitest";
import { v, ValidationError } from "./index.js";
import type { Infer } from "./index.js";

describe("primitives", () => {
  it("validates strings", () => {
    expect(v.string().parse("hi")).toBe("hi");
    expect(() => v.string().parse(42)).toThrow(ValidationError);
    expect(v.string().safeParse(42).success).toBe(false);
  });

  it("validates numbers and rejects NaN", () => {
    expect(v.number().parse(3.14)).toBe(3.14);
    expect(() => v.number().parse("3")).toThrow(/Expected number/);
    expect(() => v.number().parse(NaN)).toThrow(/Expected number/);
  });

  it("validates booleans and literals", () => {
    expect(v.boolean().parse(true)).toBe(true);
    expect(v.literal("admin").parse("admin")).toBe("admin");
    expect(() => v.literal("admin").parse("user")).toThrow(/Expected "admin"/);
  });
});

describe("string refinements", () => {
  it("enforces min/max/email/regex", () => {
    expect(() => v.string().min(3).parse("hi")).toThrow(/at least 3/);
    expect(v.string().min(2).parse("hi")).toBe("hi");
    expect(() => v.string().email().parse("nope")).toThrow(/Invalid email/);
    expect(v.string().email().parse("a@b.co")).toBe("a@b.co");
    expect(() => v.string().regex(/^\d+$/, "digits only").parse("12a")).toThrow(/digits only/);
  });
});

describe("number refinements", () => {
  it("enforces int/min/max/positive", () => {
    expect(() => v.number().int().parse(1.5)).toThrow(/integer/);
    expect(() => v.number().positive().parse(-1)).toThrow(/positive/);
    expect(() => v.number().min(10).parse(5)).toThrow(/>= 10/);
    expect(v.number().int().positive().min(1).parse(7)).toBe(7);
  });
});

describe("arrays", () => {
  it("validates each element with indexed paths", () => {
    const schema = v.array(v.number());
    expect(schema.parse([1, 2, 3])).toEqual([1, 2, 3]);
    const res = schema.safeParse([1, "two", 3]);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.path).toEqual([1]);
      expect(res.error.message).toMatch(/\[1\]/);
    }
  });
  it("supports nonempty/min", () => {
    expect(() => v.array(v.string()).nonempty().parse([])).toThrow(/empty/);
    expect(() => v.array(v.string()).min(2).parse(["a"])).toThrow(/at least 2/);
  });
});

describe("objects", () => {
  const User = v.object({
    id: v.number().int().positive(),
    name: v.string().min(1),
    email: v.string().email(),
    bio: v.string().optional(),
  });

  it("parses a valid object and strips unknown keys", () => {
    const parsed = User.parse({
      id: 1,
      name: "Ada",
      email: "ada@x.io",
      extra: "ignored",
    });
    expect(parsed).toEqual({ id: 1, name: "Ada", email: "ada@x.io" });
    expect("extra" in parsed).toBe(false);
  });

  it("allows omitting optional keys", () => {
    const parsed = User.parse({ id: 2, name: "Lin", email: "lin@x.io" });
    expect(parsed.bio).toBeUndefined();
    expect("bio" in parsed).toBe(false);
  });

  it("aggregates multiple issues with nested paths", () => {
    const res = User.safeParse({ id: -1, name: "", email: "bad" });
    expect(res.success).toBe(false);
    if (!res.success) {
      const paths = res.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("id");
      expect(paths).toContain("name");
      expect(paths).toContain("email");
      expect(res.error.issues.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("validates deeply nested objects and arrays", () => {
    const Team = v.object({
      name: v.string(),
      members: v.array(v.object({ name: v.string(), age: v.number() })),
    });
    const res = Team.safeParse({
      name: "Core",
      members: [{ name: "Ada", age: 30 }, { name: "Lin", age: "old" }],
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.message).toMatch(/members\[1\]\.age/);
    }
  });
});

describe("unions, optional, nullable", () => {
  it("matches the first valid union option", () => {
    const Role = v.union(v.literal("admin"), v.literal("user"));
    expect(Role.parse("admin")).toBe("admin");
    expect(Role.parse("user")).toBe("user");
    expect(() => Role.parse("guest")).toThrow(/any option/);
  });
  it("handles optional and nullable", () => {
    expect(v.string().optional().parse(undefined)).toBeUndefined();
    expect(v.string().nullable().parse(null)).toBeNull();
    expect(v.string().nullable().parse("x")).toBe("x");
    expect(() => v.string().optional().parse(123)).toThrow();
  });
});

describe("end-to-end: typed parse of untrusted JSON", () => {
  it("returns a fully typed value", () => {
    const Config = v.object({
      mode: v.union(v.literal("dark"), v.literal("light")),
      retries: v.number().int().min(0),
      plugins: v.array(v.string()),
    });
    type Config = Infer<typeof Config>;
    const raw: unknown = JSON.parse('{"mode":"dark","retries":3,"plugins":["a","b"]}');
    const config: Config = Config.parse(raw);
    expect(config.mode).toBe("dark");
    expect(config.plugins).toHaveLength(2);
  });
});
