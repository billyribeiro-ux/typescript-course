import { describe, it, expect, afterAll } from "vitest";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rm } from "node:fs/promises";
import type { Task } from "./types.js";
import { parseTasks, loadTasks, saveTasks } from "./store.js";

describe("parseTasks", () => {
  it("returns [] for non-arrays", () => {
    expect(parseTasks(null)).toEqual([]);
    expect(parseTasks({})).toEqual([]);
    expect(parseTasks("nope")).toEqual([]);
  });
  it("keeps valid task objects and drops malformed ones", () => {
    const input = [
      { id: 1, title: "ok", done: false, priority: "high", createdAt: "2026-01-01T00:00:00.000Z" },
      { id: "x", title: "bad id" }, // dropped
      { id: 2, title: "bad priority", done: false, priority: "urgent", createdAt: "x" }, // dropped
    ];
    const out = parseTasks(input);
    expect(out).toHaveLength(1);
    expect(out[0]?.title).toBe("ok");
  });
});

describe("loadTasks / saveTasks round-trip", () => {
  const file = join(tmpdir(), `p01-test-${Date.now()}`, "tasks.json");
  afterAll(async () => {
    await rm(join(tmpdir(), `p01-test`), { recursive: true, force: true }).catch(() => {});
    await rm(file, { force: true }).catch(() => {});
  });

  it("returns [] when the file does not exist", async () => {
    expect(await loadTasks(join(tmpdir(), "definitely-missing-xyz", "tasks.json"))).toEqual([]);
  });

  it("saves then loads the same tasks", async () => {
    const tasks: Task[] = [
      { id: 1, title: "Persist me", done: false, priority: "medium", createdAt: "2026-01-01T00:00:00.000Z" },
    ];
    await saveTasks(file, tasks);
    const loaded = await loadTasks(file);
    expect(loaded).toEqual(tasks);
  });
});
