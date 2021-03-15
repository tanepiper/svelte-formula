import { FormulaOptions } from '../../types';

/**
 * Creates an enrichment object for the named group,
 * @param name
 * @param options
 */
export function createEnrichField<T extends {} = Record<string, unknown>>(
  name: string,
  options: FormulaOptions,
): (value: unknown) => T {
  return (value: unknown): T =>
    Object.entries(options.enrich[name]).reduce((a, [key, fn]) => {
      a[key] = fn(value);
      return a;
    }, {}) as T;
}
