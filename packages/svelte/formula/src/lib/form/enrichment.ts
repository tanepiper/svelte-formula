import { FormulaOptions } from '../../types';

/**
 * Create an enrichment object for the field
 * @param name
 * @param options

 */
export function createEnrichField(
  name: string,
  options: FormulaOptions,
): (value: unknown | unknown[]) => Record<string, unknown | unknown[]> {
  return (value: unknown | unknown[]): Record<string, unknown | unknown[]> => {
    const results: Record<string, unknown> = {};
    for (const [key, fn] of Object.entries(options.enrich[name])) {
      results[key] = fn(value);
    }
    return results;
  };
}
