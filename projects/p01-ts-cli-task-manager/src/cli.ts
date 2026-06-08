/**
 * The command layer. `runCommand` is deliberately PURE: it takes the current
 * tasks plus the parsed arguments and returns the next tasks plus the text to
 * print. That purity is what lets us test the entire CLI without touching disk.
 */
import type { Priority, Task } from "./types.js";
import {
  addTask,
  filterByStatus,
  hasTask,
  isPriority,
  removeTask,
  renameTask,
  setPriority,
  sortByPriority,
  summarize,
  toggleTask,
} from "./tasks.js";

export interface CommandResult {
  readonly tasks: Task[];
  readonly output: string;
  /** Whether the task list changed and should be saved. */
  readonly changed: boolean;
}

const ICON: Record<Priority, string> = { low: "🟢", medium: "🟡", high: "🔴" };

export function formatTask(task: Task): string {
  const box = task.done ? "[x]" : "[ ]";
  return `${box} #${task.id} ${ICON[task.priority]} ${task.title}`;
}

export function formatList(tasks: readonly Task[]): string {
  if (tasks.length === 0) return "No tasks yet. Add one with: tasks add \"My task\"";
  return sortByPriority(tasks).map(formatTask).join("\n");
}

export const HELP = `Task Manager — usage:
  tasks add <title> [--priority low|medium|high]   Add a task
  tasks list [--done|--pending]                    List tasks
  tasks done <id>                                  Toggle a task's done state
  tasks rename <id> <title>                        Rename a task
  tasks priority <id> <low|medium|high>            Change priority
  tasks rm <id>                                    Remove a task
  tasks summary                                    Show counts
  tasks help                                       Show this help`;

/** Extract a `--priority <value>` flag from args, returning the value + remaining args. */
function takePriorityFlag(args: readonly string[]): { priority?: Priority; rest: string[] } {
  const i = args.indexOf("--priority");
  if (i === -1) return { rest: [...args] };
  const value = args[i + 1];
  if (!isPriority(value)) {
    throw new Error(`Invalid priority "${value ?? ""}". Use low, medium, or high.`);
  }
  const rest = [...args.slice(0, i), ...args.slice(i + 2)];
  return { priority: value, rest };
}

function parseId(raw: string | undefined): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Expected a valid task id, got "${raw ?? ""}".`);
  }
  return id;
}

/**
 * Run one command against the current task list.
 * @param tasks current tasks
 * @param argv  command + arguments, e.g. ["add", "Buy milk", "--priority", "high"]
 */
export function runCommand(tasks: readonly Task[], argv: readonly string[]): CommandResult {
  const [command, ...args] = argv;
  const unchanged = (output: string): CommandResult => ({ tasks: [...tasks], output, changed: false });

  switch (command) {
    case undefined:
    case "help":
      return unchanged(HELP);

    case "list": {
      if (args.includes("--done")) return unchanged(formatList(filterByStatus(tasks, true)));
      if (args.includes("--pending")) return unchanged(formatList(filterByStatus(tasks, false)));
      return unchanged(formatList(tasks));
    }

    case "add": {
      const { priority, rest } = takePriorityFlag(args);
      const title = rest.join(" ").trim();
      if (!title) throw new Error('Provide a title, e.g. tasks add "Buy milk".');
      const next = addTask(tasks, priority === undefined ? { title } : { title, priority });
      const created = next[next.length - 1]!;
      return { tasks: next, output: `Added ${formatTask(created)}`, changed: true };
    }

    case "done": {
      const id = parseId(args[0]);
      if (!hasTask(tasks, id)) throw new Error(`No task with id #${id}.`);
      const next = toggleTask(tasks, id);
      const updated = next.find((t) => t.id === id)!;
      return { tasks: next, output: `Updated ${formatTask(updated)}`, changed: true };
    }

    case "rename": {
      const id = parseId(args[0]);
      if (!hasTask(tasks, id)) throw new Error(`No task with id #${id}.`);
      const title = args.slice(1).join(" ").trim();
      if (!title) throw new Error("Provide the new title.");
      const next = renameTask(tasks, id, title);
      return { tasks: next, output: `Renamed #${id} → "${title}"`, changed: true };
    }

    case "priority": {
      const id = parseId(args[0]);
      if (!hasTask(tasks, id)) throw new Error(`No task with id #${id}.`);
      const value = args[1];
      if (!isPriority(value)) throw new Error(`Invalid priority "${value ?? ""}".`);
      const next = setPriority(tasks, id, value);
      return { tasks: next, output: `Set #${id} priority to ${value}`, changed: true };
    }

    case "rm": {
      const id = parseId(args[0]);
      if (!hasTask(tasks, id)) throw new Error(`No task with id #${id}.`);
      return { tasks: removeTask(tasks, id), output: `Removed #${id}`, changed: true };
    }

    case "summary": {
      const s = summarize(tasks);
      const lines = [
        `Total: ${s.total}  ·  Done: ${s.done}  ·  Pending: ${s.pending}`,
        `By priority — 🔴 high: ${s.byPriority.high}  🟡 medium: ${s.byPriority.medium}  🟢 low: ${s.byPriority.low}`,
      ];
      return unchanged(lines.join("\n"));
    }

    default:
      throw new Error(`Unknown command "${command}". Run "tasks help".`);
  }
}
