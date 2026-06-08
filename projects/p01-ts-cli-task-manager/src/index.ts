#!/usr/bin/env node
/**
 * The entry point: the only place that touches the outside world. It loads
 * tasks from disk, runs the pure command, prints the result, and saves if
 * anything changed. All the logic lives in the pure, tested modules.
 */
import { homedir } from "node:os";
import { join } from "node:path";
import { loadTasks, saveTasks } from "./store.js";
import { runCommand } from "./cli.js";

const DATA_FILE = process.env.TASKS_FILE ?? join(homedir(), ".tasks", "tasks.json");

async function main(): Promise<void> {
  const argv = process.argv.slice(2); // drop "node" and the script path
  const tasks = await loadTasks(DATA_FILE);

  try {
    const result = runCommand(tasks, argv);
    console.log(result.output);
    if (result.changed) {
      await saveTasks(DATA_FILE, result.tasks);
    }
  } catch (err) {
    console.error("✖ " + (err instanceof Error ? err.message : String(err)));
    process.exitCode = 1;
  }
}

void main();
