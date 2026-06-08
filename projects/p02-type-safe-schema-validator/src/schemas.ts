/**
 * The RUNTIME engine: schema classes that validate `unknown` data and, paired
 * with types.ts, give you end-to-end type safety from a single declaration.
 *
 *   const User = v.object({ name: v.string(), age: v.number().int() });
 *   type User = Infer<typeof User>;        // { name: string; age: number }
 *   const user = User.parse(jsonFromApi);  // throws ValidationError if invalid
 */
import type { Infer, InferObject, ObjectShape, SafeParseResult } from "./types.js";
import type { Issue } from "./error.js";
import { ValidationError, typeName } from "./error.js";

type Path = ReadonlyArray<string | number>;

/** A check applied after the base type passes (e.g. min length, positivity). */
interface Check<T> {
  readonly run: (value: T) => boolean;
  readonly message: string;
}

/** The abstract base every schema extends. `Output` is the validated type. */
export abstract class Schema<Output> {
  /** Validate a value, pushing any issues into `issues`. Returns the (typed) value. */
  protected abstract check(value: unknown, path: Path, issues: Issue[]): Output;

  /**
   * Refinements that run after the base check succeeds. Type-erased to
   * `Check<unknown>` ON PURPOSE: it keeps `Output` out of any visible
   * contravariant position, so `Schema<string>` stays assignable to
   * `Schema<unknown>` (covariance). That assignability is what lets
   * `v.object`, `v.array`, and `v.union` accept schemas of concrete types.
   */
  protected refinements: ReadonlyArray<Check<unknown>> = [];

  /** Internal: run base check + refinements at a given path. */
  _parse(value: unknown, path: Path, issues: Issue[]): Output {
    const before = issues.length;
    const result = this.check(value, path, issues);
    if (issues.length === before) {
      for (const r of this.refinements) {
        if (!r.run(result)) issues.push({ path, message: r.message });
      }
    }
    return result;
  }

  /** Validate, throwing a ValidationError with every issue if invalid. */
  parse(value: unknown): Output {
    const issues: Issue[] = [];
    const result = this._parse(value, [], issues);
    if (issues.length > 0) throw new ValidationError(issues);
    return result;
  }

  /** Validate without throwing — returns a discriminated result. */
  safeParse(value: unknown): SafeParseResult<Output> {
    try {
      return { success: true, data: this.parse(value) };
    } catch (err) {
      if (err instanceof ValidationError) return { success: false, error: err };
      throw err;
    }
  }

  /** Make this schema accept `undefined` (and become an optional object key). */
  optional(): OptionalSchema<Output> {
    return new OptionalSchema(this);
  }

  /** Make this schema accept `null`. */
  nullable(): NullableSchema<Output> {
    return new NullableSchema(this);
  }

  /**
   * Add a custom predicate refinement, returning a NEW schema (immutable).
   * The clone shares the subclass prototype + copied fields, then appends the
   * (type-erased) check, so chaining like `.min(2).email()` accumulates rules.
   */
  refine(run: (value: Output) => boolean, message: string): this {
    const clone: this = Object.assign(Object.create(Object.getPrototypeOf(this) as object), this);
    clone.refinements = [...this.refinements, { run: run as (value: unknown) => boolean, message }];
    return clone;
  }
}

/* ------------------------------- primitives ------------------------------- */

export class StringSchema extends Schema<string> {
  protected check(value: unknown, path: Path, issues: Issue[]): string {
    if (typeof value !== "string") {
      issues.push({ path, message: `Expected string, received ${typeName(value)}` });
      return "";
    }
    return value;
  }
  min(n: number): this {
    return this.refine((s) => s.length >= n, `Must be at least ${n} characters`);
  }
  max(n: number): this {
    return this.refine((s) => s.length <= n, `Must be at most ${n} characters`);
  }
  email(): this {
    return this.refine((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s), "Invalid email");
  }
  regex(re: RegExp, message = "Invalid format"): this {
    return this.refine((s) => re.test(s), message);
  }
}

export class NumberSchema extends Schema<number> {
  protected check(value: unknown, path: Path, issues: Issue[]): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      issues.push({ path, message: `Expected number, received ${typeName(value)}` });
      return 0;
    }
    return value;
  }
  int(): this {
    return this.refine((n) => Number.isInteger(n), "Must be an integer");
  }
  min(n: number): this {
    return this.refine((v) => v >= n, `Must be >= ${n}`);
  }
  max(n: number): this {
    return this.refine((v) => v <= n, `Must be <= ${n}`);
  }
  positive(): this {
    return this.refine((v) => v > 0, "Must be positive");
  }
}

export class BooleanSchema extends Schema<boolean> {
  protected check(value: unknown, path: Path, issues: Issue[]): boolean {
    if (typeof value !== "boolean") {
      issues.push({ path, message: `Expected boolean, received ${typeName(value)}` });
      return false;
    }
    return value;
  }
}

export class LiteralSchema<L extends string | number | boolean> extends Schema<L> {
  constructor(private readonly literal: L) {
    super();
  }
  protected check(value: unknown, path: Path, issues: Issue[]): L {
    if (value !== this.literal) {
      issues.push({ path, message: `Expected ${JSON.stringify(this.literal)}` });
    }
    return this.literal;
  }
}

/* ------------------------------- wrappers --------------------------------- */

export class OptionalSchema<T> extends Schema<T | undefined> {
  constructor(private readonly inner: Schema<T>) {
    super();
  }
  protected check(value: unknown, path: Path, issues: Issue[]): T | undefined {
    if (value === undefined) return undefined;
    return this.inner._parse(value, path, issues);
  }
}

export class NullableSchema<T> extends Schema<T | null> {
  constructor(private readonly inner: Schema<T>) {
    super();
  }
  protected check(value: unknown, path: Path, issues: Issue[]): T | null {
    if (value === null) return null;
    return this.inner._parse(value, path, issues);
  }
}

/* ----------------------------- collections -------------------------------- */

export class ArraySchema<T> extends Schema<T[]> {
  constructor(private readonly element: Schema<T>) {
    super();
  }
  protected check(value: unknown, path: Path, issues: Issue[]): T[] {
    if (!Array.isArray(value)) {
      issues.push({ path, message: `Expected array, received ${typeName(value)}` });
      return [];
    }
    const out: T[] = [];
    for (let i = 0; i < value.length; i++) {
      out.push(this.element._parse(value[i], [...path, i], issues));
    }
    return out;
  }
  min(n: number): this {
    return this.refine((a) => a.length >= n, `Must have at least ${n} item(s)`);
  }
  nonempty(): this {
    return this.refine((a) => a.length > 0, "Must not be empty");
  }
}

export class ObjectSchema<S extends ObjectShape> extends Schema<InferObject<S>> {
  constructor(private readonly shape: S) {
    super();
  }
  protected check(value: unknown, path: Path, issues: Issue[]): InferObject<S> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      issues.push({ path, message: `Expected object, received ${typeName(value)}` });
      return {} as InferObject<S>;
    }
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (!fieldSchema) continue;
      const raw = source[key];
      const parsed = fieldSchema._parse(raw, [...path, key], issues);
      // Omit absent optional keys instead of writing `undefined`.
      if (!(fieldSchema instanceof OptionalSchema && raw === undefined)) {
        result[key] = parsed;
      }
    }
    return result as InferObject<S>;
  }
}

/* ------------------------------- unions ----------------------------------- */

export class UnionSchema<T extends ReadonlyArray<Schema<unknown>>> extends Schema<
  Infer<T[number]>
> {
  constructor(private readonly options: T) {
    super();
  }
  protected check(value: unknown, path: Path, issues: Issue[]): Infer<T[number]> {
    for (const option of this.options) {
      const localIssues: Issue[] = [];
      const result = option._parse(value, path, localIssues);
      if (localIssues.length === 0) return result as Infer<T[number]>;
    }
    issues.push({ path, message: "Did not match any option in the union" });
    return undefined as Infer<T[number]>;
  }
}

/* ------------------------------- factory ---------------------------------- */

/** The public, ergonomic builder API. */
export const v = {
  string: (): StringSchema => new StringSchema(),
  number: (): NumberSchema => new NumberSchema(),
  boolean: (): BooleanSchema => new BooleanSchema(),
  literal: <const L extends string | number | boolean>(value: L): LiteralSchema<L> =>
    new LiteralSchema(value),
  array: <T>(element: Schema<T>): ArraySchema<T> => new ArraySchema(element),
  object: <S extends ObjectShape>(shape: S): ObjectSchema<S> => new ObjectSchema(shape),
  union: <T extends readonly [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]]>(
    ...options: T
  ): UnionSchema<T> => new UnionSchema(options),
} as const;
