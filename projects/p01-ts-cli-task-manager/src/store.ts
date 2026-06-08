/**
 * Persistence: load and save the task list to a JSON file on disk.
 * Isolated here so the pure core (tasks.ts) stays free of I/O.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { Task } from "./types.js";
import { isPriority } from "./tasks.js";

/** Narrow an unknown parsed value into a Task[], discarding anything malformed. */
export function parseTasks(data: unknown): Task[] {
  if (!Array.isArray(data)) return [];
  const result: Task[] = [];
  for (const item of data) {
    if (
      item &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).id === "number" &&
      typeof (item as Record<string, unknown>).title === "string" &&
      typeof (item as Record<string, unknown>).done === "boolean" &&
      isPriority((item as Record<string, unknown>).priority) &&
      typeof (item as Record<string, unknown>).createdAt === "string"
    ) {
      const obj = item as Record<string, unknown>;
      result.push({
        id: obj.id as number,
        title: obj.title as string,
        done: obj.done as boolean,
        priority: obj.priority as Task["priority"],
        createdAt: obj.createdAt as string,
      });
    }
  }
  return result;
}

/** Load tasks from a file. Returns [] if the file does not exist yet. */
export async function loadTasks(filePath: string): Promise<Task[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    return parseTasks(JSON.parse(raw));
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

/** Save tasks to a file, creating the directory if needed. */
export async function saveTasks(filePath: string, tasks: readonly Task[]): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(tasks, null, 2) + "\n", "utf8");
}
