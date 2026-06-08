/**
 * The TYPE-LEVEL engine of the validator. None of this exists at runtime — it is
 * pure compile-time logic that derives a static TypeScript type from a schema
 * value. This is the heart of "parse, don't validate": one schema is BOTH the
 * runtime validator AND the source of the static type.
 */
import type { Schema, OptionalSchema } from "./schemas.js";

/** Extract the output type a schema validates to: Infer<typeof userSchema>. */
export type Infer<S> = S extends Schema<infer T> ? T : never;

/** Flatten an intersection into a single clean object type (better tooltips). */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/** The shape passed to `v.object({ ... })`. */
export type ObjectShape = Record<string, Schema<unknown>>;

/** Keys whose schema is optional (built with `.optional()`). */
type OptionalKeys<S extends ObjectShape> = {
  [K in keyof S]: S[K] extends OptionalSchema<unknown> ? K : never;
}[keyof S];

/** Keys whose schema is required (everything that is not optional). */
type RequiredKeys<S extends ObjectShape> = Exclude<keyof S, OptionalKeys<S>>;

/**
 * Turn an object shape into its inferred type, correctly splitting required and
 * optional keys via key remapping + conditional types.
 */
export type InferObject<S extends ObjectShape> = Prettify<
  { [K in RequiredKeys<S>]: Infer<S[K]> } & { [K in OptionalKeys<S>]?: Infer<S[K]> }
>;

/** The result of safeParse: a discriminated union — no exceptions to catch. */
export type SafeParseResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: import("./error.js").ValidationError };
