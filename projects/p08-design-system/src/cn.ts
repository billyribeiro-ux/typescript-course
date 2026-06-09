/**
 * cn — a tiny class-name combiner (the clsx pattern). Accepts strings, arrays,
 * and objects of { className: boolean }, and joins the truthy ones. This is the
 * glue every styled component uses to compose conditional classes.
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[] | ClassDict;
export interface ClassDict {
  readonly [className: string]: boolean | null | undefined;
}

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const push = (value: ClassValue): void => {
    if (!value) return;
    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
    } else if (Array.isArray(value)) {
      for (const item of value) push(item);
    } else {
      for (const key of Object.keys(value)) {
        if (value[key]) out.push(key);
      }
    }
  };

  for (const input of inputs) push(input);
  // De-duplicate while preserving last-wins order (a simple conflict resolver).
  return dedupe(out.join(" "));
}

/** Collapse repeated whitespace and drop duplicate tokens (keeping the last). */
function dedupe(value: string): string {
  const tokens = value.split(/\s+/).filter(Boolean);
  const seen = new Set<string>();
  const result: string[] = [];
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i]!;
    if (!seen.has(token)) {
      seen.add(token);
      result.unshift(token);
    }
  }
  return result.join(" ");
}
