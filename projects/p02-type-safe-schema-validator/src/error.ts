/**
 * A single validation problem, with the path to where it occurred
 * (e.g. ["address", "zip"] or ["items", 0]).
 */
export interface Issue {
  readonly path: ReadonlyArray<string | number>;
  readonly message: string;
}

/** Render a path like ["items", 0, "name"] as "items[0].name". */
export function formatPath(path: ReadonlyArray<string | number>): string {
  let out = "";
  for (const segment of path) {
    if (typeof segment === "number") out += `[${segment}]`;
    else out += out === "" ? segment : `.${segment}`;
  }
  return out;
}

/** Thrown by `parse` when validation fails. Aggregates every issue found. */
export class ValidationError extends Error {
  readonly issues: ReadonlyArray<Issue>;

  constructor(issues: ReadonlyArray<Issue>) {
    const summary = issues
      .map((i) => {
        const p = formatPath(i.path);
        return p ? `${p}: ${i.message}` : i.message;
      })
      .join("; ");
    super(summary);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

/** Describe the runtime type of a value for friendly error messages. */
export function typeName(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
