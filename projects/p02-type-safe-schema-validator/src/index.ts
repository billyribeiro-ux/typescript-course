/**
 * Public entry point for the validator library.
 *
 *   import { v, type Infer } from "p02-type-safe-schema-validator";
 *
 *   const User = v.object({
 *     id: v.number().int().positive(),
 *     name: v.string().min(1),
 *     email: v.string().email(),
 *     role: v.union(v.literal("admin"), v.literal("user")),
 *     bio: v.string().optional(),
 *   });
 *   type User = Infer<typeof User>;
 *   const user = User.parse(await res.json()); // typed + validated
 */
export { v, Schema } from "./schemas.js";
export {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  LiteralSchema,
  ArraySchema,
  ObjectSchema,
  UnionSchema,
  OptionalSchema,
  NullableSchema,
} from "./schemas.js";
export { ValidationError, formatPath } from "./error.js";
export type { Issue } from "./error.js";
export type { Infer, InferObject, SafeParseResult } from "./types.js";
