import { FormEl, FormulaError, FormulaOptions, FormulaStores } from '../../types';
import { createFieldExtract } from './extract';
import { createEnrichField } from './enrichment';

/**
 * Initialise the stores with data from the form, it will also use any default values provided
 * @param node
 * @param allGroups
 * @param stores
 * @param options
 */
function getInitialFormValues(
  node: HTMLElement,
  allGroups: [string, FormEl[]][],
  stores: FormulaStores,
  options: FormulaOptions,
): [Record<string, unknown | unknown[]>, Record<string, FormulaError>, Record<string, Record<string, unknown>>] {
  const formValues: Record<string, unknown | unknown[]> = {};
  const validityValues: Record<string, FormulaError> = {};
  const enrichmentValues: Record<string, Record<string, unknown>> = {};
  for (const [key, elements] of allGroups) {
    const extract = createFieldExtract(key, elements, options, stores);
    const { name, value, ...validity } = extract(elements[0], true);
    formValues[name] = value;
    validityValues[name] = validity;
    if (options?.enrich?.[name]) {
      const enrich = createEnrichField(name, options);
      enrichmentValues[name] = enrich(value);
    }
  }
  stores.formValues.set({ ...formValues });
  stores.initialValues.set({ ...formValues });
  stores.validity.set({ ...validityValues });
  stores.isFormValid.set(Object.values({ ...validityValues }).every((v: FormulaError) => v.valid));
  stores.enrichment.set({ ...enrichmentValues });

  return [formValues, validityValues, enrichmentValues];
}

/**
 * Create the form reset method

 */
export function createReset(
  node: HTMLElement,
  allGroups: [string, FormEl[]][],
  stores: FormulaStores,
  options: FormulaOptions,
) {
  const [formValues, validityValues, enrichmentValues] = getInitialFormValues(node, allGroups, stores, options);
  /**
   * Resets the form to the initial values
   */
  return () => {
    stores.formValues.set(formValues);
    stores.validity.set(validityValues);
    stores.isFormValid.set(Object.values(validityValues).every((v: FormulaError) => v.valid));
    stores.enrichment.set(enrichmentValues);
    // Also override touched and dirty
    stores.touched.set(Object.keys(formValues).reduce((val, key) => ({ ...val, [key]: false }), {}));
    stores.dirty.set(Object.keys(formValues).reduce((val, key) => ({ ...val, [key]: false }), {}));

    // Update the elements
    for (const [key, elements] of allGroups) {
      const extract = createFieldExtract(key, elements, options, stores);
      extract(elements[0], false, true);
    }
  };
}
