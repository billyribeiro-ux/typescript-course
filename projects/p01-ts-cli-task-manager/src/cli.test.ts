import { describe, it, expect } from "vitest";
import type { Task } from "./types.js";
import { runCommand, formatTask, formatList } from "./cli.js";

function make(partial: Partial<Task> & Pick<Task, "id" | "title">): Task {
  return { done: false, priority: "medium", createdAt: "2026-01-01T00:00:00.000Z", ...partial };
}

const tasks: Task[] = [
  make({ id: 1, title: "Write tests", priority: "high" }),
  make({ id: 2, title: "Ship it", done: true, priority: "low" }),
];

describe("formatTask / formatList", () => {
  it("formats a single task with checkbox and priority icon", () => {
    expect(formatTask(tasks[0]!)).toBe("[ ] #1 🔴 Write tests");
    expect(formatTask(tasks[1]!)).toBe("[x] #2 🟢 Ship it");
  });
  it("shows an empty-state message for no tasks", () => {
    expect(formatList([])).toMatch(/No tasks yet/);
  });
});

describe("runCommand · add", () => {
  it("adds a task and flags the list as changed", () => {
    const r = runCommand(tasks, ["add", "Buy", "milk", "--priority", "high"]);
    expect(r.changed).toBe(true);
    expect(r.tasks).toHaveLength(3);
    expect(r.tasks[2]).toMatchObject({ title: "Buy milk", priority: "high" });
    expect(r.output).toMatch(/Added/);
  });
  it("rejects an invalid priority flag", () => {
    expect(() => runCommand(tasks, ["add", "X", "--priority", "nope"])).toThrow(/priority/i);
  });
  it("requires a title", () => {
    expect(() => runCommand(tasks, ["add"])).toThrow(/title/i);
  });
});

describe("runCommand · done / rm / rename / priority", () => {
  it("toggles done", () => {
    const r = runCommand(tasks, ["done", "1"]);
    expect(r.changed).toBe(true);
    expect(r.tasks.find((t) => t.id === 1)?.done).toBe(true);
  });
  it("removes a task", () => {
    const r = runCommand(tasks, ["rm", "2"]);
    expect(r.tasks).toHaveLength(1);
  });
  it("renames a task", () => {
    const r = runCommand(tasks, ["rename", "1", "New", "name"]);
    expect(r.tasks.find((t) => t.id === 1)?.title).toBe("New name");
  });
  it("changes priority", () => {
    const r = runCommand(tasks, ["priority", "1", "low"]);
    expect(r.tasks.find((t) => t.id === 1)?.priority).toBe("low");
  });
  it("errors on an unknown id", () => {
    expect(() => runCommand(tasks, ["done", "999"])).toThrow(/No task/i);
  });
  it("errors on a non-numeric id", () => {
    expect(() => runCommand(tasks, ["done", "abc"])).toThrow(/valid task id/i);
  });
});

describe("runCommand · list / summary / help", () => {
  it("lists all, done-only, and pending-only without changing state", () => {
    expect(runCommand(tasks, ["list"]).changed).toBe(false);
    expect(runCommand(tasks, ["list", "--done"]).output).toMatch(/Ship it/);
    expect(runCommand(tasks, ["list", "--done"]).output).not.toMatch(/Write tests/);
    expect(runCommand(tasks, ["list", "--pending"]).output).toMatch(/Write tests/);
  });
  it("summarizes counts", () => {
    const out = runCommand(tasks, ["summary"]).output;
    expect(out).toMatch(/Total: 2/);
    expect(out).toMatch(/Done: 1/);
  });
  it("shows help for no command and for help", () => {
    expect(runCommand(tasks, []).output).toMatch(/usage/i);
    expect(runCommand(tasks, ["help"]).output).toMatch(/usage/i);
  });
  it("throws on an unknown command", () => {
    expect(() => runCommand(tasks, ["frobnicate"])).toThrow(/Unknown command/i);
  });
});
