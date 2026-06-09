import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  ApiError,
  type Context,
} from "./api.js";
import { authorize, ForbiddenError, type Role } from "./permissions.js";

// Example procedures (the kind a real tRPC router would hold):
const health = publicProcedure.query(() => ({ ok: true }));

const createProject = protectedProcedure
  .input(z.object({ name: z.string().min(1) }))
  .mutation(({ ctx, input }) => {
    authorize(ctx.user.role, "project:create"); // ctx.user is non-null here (typed)
    return { id: "p1", name: input.name, orgId: ctx.user.orgId };
  });

const ctxWith = (role: Role | null): Context =>
  role === null ? { user: null } : { user: { id: "u1", orgId: "o1", role } };

describe("procedure layer", () => {
  it("runs a public procedure without a user", async () => {
    expect(await health.call(ctxWith(null))).toEqual({ ok: true });
  });

  it("rejects a protected procedure when unauthenticated", async () => {
    await expect(createProject.call(ctxWith(null), { name: "X" })).rejects.toBeInstanceOf(ApiError);
    await expect(createProject.call(ctxWith(null), { name: "X" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("validates input with Zod (BAD_REQUEST on failure)", async () => {
    await expect(createProject.call(ctxWith("member"), { name: "" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("enforces authorization inside the resolver", async () => {
    await expect(createProject.call(ctxWith("viewer"), { name: "Site" })).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("succeeds for an authorized user with valid input", async () => {
    const result = await createProject.call(ctxWith("member"), { name: "Site" });
    expect(result).toEqual({ id: "p1", name: "Site", orgId: "o1" });
  });
});
