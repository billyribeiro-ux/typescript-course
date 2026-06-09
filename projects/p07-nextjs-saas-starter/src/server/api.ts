/**
 * A miniature, fully-typed "procedure" layer — the same idea as tRPC (07-07),
 * small enough to read and test. A procedure optionally validates its input
 * with Zod, optionally requires auth, and runs a typed resolver. This is the
 * core pattern behind type-safe SaaS APIs.
 */
import { z, type ZodTypeAny } from "zod";
import type { Role } from "./permissions.js";

export interface SessionUser {
  id: string;
  orgId: string;
  role: Role;
}
export interface Context {
  user: SessionUser | null;
}
export interface AuthedContext extends Context {
  user: SessionUser;
}

export class ApiError extends Error {
  constructor(
    public readonly code: "UNAUTHORIZED" | "BAD_REQUEST" | "FORBIDDEN",
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Resolver<Ctx, In, Out> = (args: { ctx: Ctx; input: In }) => Out | Promise<Out>;

/** A built, callable procedure. */
export class Procedure<Ctx extends Context, In, Out> {
  constructor(
    private readonly requireAuth: boolean,
    private readonly schema: ZodTypeAny | null,
    private readonly resolver: Resolver<Ctx, In, Out>,
  ) {}

  /** Validate input + enforce auth, then run the resolver. */
  async call(ctx: Context, rawInput?: unknown): Promise<Out> {
    if (this.requireAuth && ctx.user === null) {
      throw new ApiError("UNAUTHORIZED", "Authentication required");
    }
    let input = undefined as In;
    if (this.schema) {
      const result = this.schema.safeParse(rawInput);
      if (!result.success) {
        throw new ApiError("BAD_REQUEST", result.error.issues[0]?.message ?? "Invalid input");
      }
      input = result.data as In;
    }
    return this.resolver({ ctx: ctx as Ctx, input });
  }
}

/** Builds a procedure: choose auth, input schema, then a query/mutation resolver. */
class ProcedureBuilder<Ctx extends Context, In> {
  constructor(
    private readonly requireAuth: boolean,
    private readonly schema: ZodTypeAny | null,
  ) {}

  /** Require an authenticated user; narrows `ctx.user` to non-null in the resolver. */
  protected(): ProcedureBuilder<AuthedContext, In> {
    return new ProcedureBuilder<AuthedContext, In>(true, this.schema);
  }

  /** Attach a Zod input schema; `input` becomes its inferred type. */
  input<S extends ZodTypeAny>(schema: S): ProcedureBuilder<Ctx, z.infer<S>> {
    return new ProcedureBuilder<Ctx, z.infer<S>>(this.requireAuth, schema);
  }

  query<Out>(resolver: Resolver<Ctx, In, Out>): Procedure<Ctx, In, Out> {
    return new Procedure(this.requireAuth, this.schema, resolver);
  }

  mutation<Out>(resolver: Resolver<Ctx, In, Out>): Procedure<Ctx, In, Out> {
    return new Procedure(this.requireAuth, this.schema, resolver);
  }
}

/** The entry point: a public procedure with no auth and no input. */
export const publicProcedure = new ProcedureBuilder<Context, undefined>(false, null);
/** A procedure that requires an authenticated user. */
export const protectedProcedure = publicProcedure.protected();
