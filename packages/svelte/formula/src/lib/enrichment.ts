import { FormulaOptions } from '../types/options';
import { FormulaStores } from '../types/formula';

/**
 * Create an enrichment object for the field
 * @param name
 * @param options
 * @param stores
 */
export function createEnrichField(
  name: string,
  options: FormulaOptions,
  stores: FormulaStores,
): (value: unknown | unknown[]) => void {
  return (value: unknown | unknown[]) => {
    stores.enrichment.update((state) => ({ ...state, [name]: {} }));
    const results: Record<string, unknown> = {};
    for (const [key, fn] of Object.entries(options.enrich[name])) {
      results[key] = fn(value);
    }
    stores.enrichment.update((state) => ({ ...state, [name]: results }));
  };
}
