import { describe, it, expect } from "vitest";
import type { Task } from "./types.js";
import {
  addTask,
  filterByStatus,
  hasTask,
  isPriority,
  nextId,
  removeTask,
  renameTask,
  setPriority,
  sortByPriority,
  summarize,
  toggleTask,
} from "./tasks.js";

function make(partial: Partial<Task> & Pick<Task, "id" | "title">): Task {
  return {
    done: false,
    priority: "medium",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

const sample: Task[] = [
  make({ id: 1, title: "A", done: true, priority: "high" }),
  make({ id: 2, title: "B", done: false, priority: "low" }),
  make({ id: 3, title: "C", done: false, priority: "medium" }),
];

describe("isPriority", () => {
  it("accepts valid priorities and rejects everything else", () => {
    expect(isPriority("low")).toBe(true);
    expect(isPriority("high")).toBe(true);
    expect(isPriority("urgent")).toBe(false);
    expect(isPriority(3)).toBe(false);
    expect(isPriority(undefined)).toBe(false);
  });
});

describe("nextId", () => {
  it("is 1 for an empty list", () => {
    expect(nextId([])).toBe(1);
  });
  it("is max id + 1 otherwise", () => {
    expect(nextId(sample)).toBe(4);
  });
});

describe("addTask", () => {
  it("appends a new task immutably with sensible defaults", () => {
    const next = addTask(sample, { title: "D" });
    expect(next).toHaveLength(4);
    expect(sample).toHaveLength(3); // original untouched
    expect(next[3]).toMatchObject({ id: 4, title: "D", done: false, priority: "medium" });
  });
  it("trims the title and honours an explicit priority", () => {
    const next = addTask([], { title: "  spaced  ", priority: "high" });
    expect(next[0]?.title).toBe("spaced");
    expect(next[0]?.priority).toBe("high");
  });
  it("throws on an empty title", () => {
    expect(() => addTask([], { title: "   " })).toThrow(/empty/i);
  });
});

describe("toggleTask", () => {
  it("flips done immutably", () => {
    const next = toggleTask(sample, 2);
    expect(next.find((t) => t.id === 2)?.done).toBe(true);
    expect(sample.find((t) => t.id === 2)?.done).toBe(false);
  });
  it("is a no-op for unknown ids", () => {
    expect(toggleTask(sample, 99)).toEqual(sample);
  });
});

describe("removeTask", () => {
  it("removes by id immutably", () => {
    const next = removeTask(sample, 1);
    expect(next).toHaveLength(2);
    expect(hasTask(next, 1)).toBe(false);
    expect(hasTask(sample, 1)).toBe(true);
  });
});

describe("renameTask", () => {
  it("renames immutably and trims", () => {
    const next = renameTask(sample, 1, "  New  ");
    expect(next.find((t) => t.id === 1)?.title).toBe("New");
  });
  it("throws on empty titles", () => {
    expect(() => renameTask(sample, 1, "")).toThrow(/empty/i);
  });
});

describe("setPriority", () => {
  it("updates the priority immutably", () => {
    const next = setPriority(sample, 2, "high");
    expect(next.find((t) => t.id === 2)?.priority).toBe("high");
    expect(sample.find((t) => t.id === 2)?.priority).toBe("low");
  });
});

describe("filterByStatus", () => {
  it("splits done and pending", () => {
    expect(filterByStatus(sample, true).map((t) => t.id)).toEqual([1]);
    expect(filterByStatus(sample, false).map((t) => t.id)).toEqual([2, 3]);
  });
});

describe("summarize", () => {
  it("counts totals and priorities", () => {
    expect(summarize(sample)).toEqual({
      total: 3,
      done: 1,
      pending: 2,
      byPriority: { low: 1, medium: 1, high: 1 },
    });
  });
  it("handles an empty list", () => {
    expect(summarize([])).toEqual({
      total: 0,
      done: 0,
      pending: 0,
      byPriority: { low: 0, medium: 0, high: 0 },
    });
  });
});

describe("sortByPriority", () => {
  it("orders high → medium → low, then by id, immutably", () => {
    const sorted = sortByPriority(sample);
    expect(sorted.map((t) => t.id)).toEqual([1, 3, 2]);
    expect(sample.map((t) => t.id)).toEqual([1, 2, 3]); // original order preserved
  });
});
