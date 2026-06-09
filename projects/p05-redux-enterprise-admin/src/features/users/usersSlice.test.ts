import { describe, it, expect } from "vitest";
import { makeStore, selectAllUsers, selectVisibleUsers, selectCurrentUser } from "../../store.js";
import { addUser, removeUser, setRole, toggleActive, renameUser } from "./usersSlice.js";
import { setSearch, setRoleFilter } from "./filtersSlice.js";
import { login, logout } from "../auth/authSlice.js";

describe("users slice", () => {
  it("seeds three users, sorted by name", () => {
    const store = makeStore();
    const names = selectAllUsers(store.getState()).map((u) => u.name);
    expect(names).toEqual(["Ada Lovelace", "Grace Hopper", "Linus Torvalds"]);
  });

  it("adds a user with a generated id", () => {
    const store = makeStore();
    store.dispatch(addUser({ name: "Margaret Hamilton", email: "maggie@acme.io", role: "editor" }));
    const users = selectAllUsers(store.getState());
    expect(users).toHaveLength(4);
    const added = users.find((u) => u.email === "maggie@acme.io")!;
    expect(added.id).toBeTruthy();
    expect(added.active).toBe(true);
  });

  it("removes a user", () => {
    const store = makeStore();
    store.dispatch(removeUser("u3"));
    expect(selectAllUsers(store.getState()).some((u) => u.id === "u3")).toBe(false);
  });

  it("changes a role immutably", () => {
    const store = makeStore();
    store.dispatch(setRole({ id: "u2", role: "admin" }));
    expect(store.getState().users.entities.u2?.role).toBe("admin");
  });

  it("toggles active and renames (ignoring blank names)", () => {
    const store = makeStore();
    store.dispatch(toggleActive("u1"));
    expect(store.getState().users.entities.u1?.active).toBe(false);
    store.dispatch(renameUser({ id: "u1", name: "  Ada L.  " }));
    expect(store.getState().users.entities.u1?.name).toBe("Ada L.");
    store.dispatch(renameUser({ id: "u1", name: "   " }));
    expect(store.getState().users.entities.u1?.name).toBe("Ada L."); // unchanged
  });
});

describe("filters + selectVisibleUsers", () => {
  it("filters by role", () => {
    const store = makeStore();
    store.dispatch(setRoleFilter("admin"));
    const visible = selectVisibleUsers(store.getState());
    expect(visible).toHaveLength(1);
    expect(visible[0]?.name).toBe("Ada Lovelace");
  });

  it("filters by search across name and email", () => {
    const store = makeStore();
    store.dispatch(setSearch("grace"));
    expect(selectVisibleUsers(store.getState()).map((u) => u.id)).toEqual(["u3"]);
    store.dispatch(setSearch("acme.io"));
    expect(selectVisibleUsers(store.getState())).toHaveLength(3); // all emails match
  });
});

describe("auth", () => {
  it("selects the current user and handles logout", () => {
    const store = makeStore();
    expect(selectCurrentUser(store.getState())?.id).toBe("u1");
    store.dispatch(login("u2"));
    expect(selectCurrentUser(store.getState())?.id).toBe("u2");
    store.dispatch(logout());
    expect(selectCurrentUser(store.getState())).toBeNull();
  });
});
