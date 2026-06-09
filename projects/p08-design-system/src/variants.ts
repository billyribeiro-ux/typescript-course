/**
 * cva — a minimal, fully-typed variant API (the class-variance-authority
 * pattern). Define a base class plus named variant groups; the returned
 * function takes a typed selection and produces the merged class string.
 * This is how a design system encodes its component styles type-safely.
 */
import { cn, type ClassValue } from "./cn.js";

/** Each variant group maps option names to class strings. */
export type VariantShape = Record<string, Record<string, string>>;

/** The props the generated function accepts: one optional choice per group. */
export type VariantSelection<V extends VariantShape> = {
  [K in keyof V]?: keyof V[K];
};

export interface CvaConfig<V extends VariantShape> {
  variants?: V;
  defaultVariants?: VariantSelection<V>;
  compoundVariants?: Array<VariantSelection<V> & { class: string }>;
}

export function cva<V extends VariantShape>(base: string, config: CvaConfig<V> = {}) {
  const { variants, defaultVariants, compoundVariants } = config;

  return (props: VariantSelection<V> = {}): string => {
    const classes: ClassValue[] = [base];

    if (variants) {
      const resolve = (key: keyof V) => props[key] ?? defaultVariants?.[key];

      for (const key of Object.keys(variants) as (keyof V)[]) {
        const group = variants[key];
        const chosen = props[key] ?? defaultVariants?.[key];
        if (group && chosen != null) {
          const cls = group[chosen as string];
          if (cls) classes.push(cls);
        }
      }

      for (const compound of compoundVariants ?? []) {
        const matches = (Object.keys(compound) as (keyof typeof compound)[]).every((k) => {
          if (k === "class") return true;
          return resolve(k as keyof V) === compound[k];
        });
        if (matches) classes.push(compound.class);
      }
    }

    return cn(...classes);
  };
}

/** Extract the variant props of a cva() function — the consumer's prop type. */
export type VariantProps<F> = F extends (props?: infer P) => string ? NonNullable<P> : never;
