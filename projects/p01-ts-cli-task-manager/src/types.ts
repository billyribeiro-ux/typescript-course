/**
 * Domain types for the task manager.
 *
 * These types are the single source of truth for what a "task" is. Because the
 * whole app is built on them, a change here ripples — with the compiler's help —
 * everywhere it needs to.
 */

/** The priority levels a task can have. A union of string literals = a closed set. */
export type Priority = "low" | "medium" | "high";

/** A single task. `readonly` fields signal our immutable update style. */
export interface Task {
  readonly id: number;
  readonly title: string;
  readonly done: boolean;
  readonly priority: Priority;
  /** ISO timestamp of when the task was created. */
  readonly createdAt: string;
}

/** The shape required to create a task (the parts a user supplies). */
export interface NewTaskInput {
  readonly title: string;
  readonly priority?: Priority;
}

/** A summary of a task list, used by the `summary` command. */
export interface TaskSummary {
  readonly total: number;
  readonly done: number;
  readonly pending: number;
  readonly byPriority: Readonly<Record<Priority, number>>;
}
