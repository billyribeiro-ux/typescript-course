/**
 * The pure core of the app: functions that take a task list and return a NEW
 * task list. No mutation, no I/O, no surprises. Pure functions like these are
 * trivial to test — which is exactly why the whole test suite targets this file.
 */
import type { NewTaskInput, Priority, Task, TaskSummary } from "./types.js";

const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];

/** Type guard: is this unknown string a valid Priority? */
export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && (PRIORITIES as readonly string[]).includes(value);
}

/** Compute the next id for a list (max existing id + 1, or 1 if empty). */
export function nextId(tasks: readonly Task[]): number {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

/** Add a task immutably, returning a new array. */
export function addTask(tasks: readonly Task[], input: NewTaskInput): Task[] {
  const title = input.title.trim();
  if (title.length === 0) {
    throw new Error("Task title must not be empty.");
  }
  const task: Task = {
    id: nextId(tasks),
    title,
    done: false,
    priority: input.priority ?? "medium",
    createdAt: new Date().toISOString(),
  };
  return [...tasks, task];
}

/** Toggle a task's done state immutably. Unknown ids are a no-op (returns same list). */
export function toggleTask(tasks: readonly Task[], id: number): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

/** Remove a task immutably. */
export function removeTask(tasks: readonly Task[], id: number): Task[] {
  return tasks.filter((t) => t.id !== id);
}

/** Rename a task immutably. Throws on empty titles, like addTask. */
export function renameTask(tasks: readonly Task[], id: number, title: string): Task[] {
  const next = title.trim();
  if (next.length === 0) {
    throw new Error("Task title must not be empty.");
  }
  return tasks.map((t) => (t.id === id ? { ...t, title: next } : t));
}

/** Change a task's priority immutably. */
export function setPriority(tasks: readonly Task[], id: number, priority: Priority): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, priority } : t));
}

/** Return only done, or only pending, tasks (a new filtered array). */
export function filterByStatus(tasks: readonly Task[], done: boolean): Task[] {
  return tasks.filter((t) => t.done === done);
}

/** Does a task with this id exist? */
export function hasTask(tasks: readonly Task[], id: number): boolean {
  return tasks.some((t) => t.id === id);
}

/** Build a summary of the list, including a per-priority breakdown. */
export function summarize(tasks: readonly Task[]): TaskSummary {
  const byPriority: Record<Priority, number> = { low: 0, medium: 0, high: 0 };
  for (const t of tasks) {
    byPriority[t.priority] += 1;
  }
  const done = filterByStatus(tasks, true).length;
  return {
    total: tasks.length,
    done,
    pending: tasks.length - done,
    byPriority,
  };
}

/** Sort by priority (high → low), then by id — returns a new array. */
export function sortByPriority(tasks: readonly Task[]): Task[] {
  const rank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => rank[a.priority] - rank[b.priority] || a.id - b.id);
}
