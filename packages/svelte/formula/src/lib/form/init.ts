import { FormEl, FormulaError, FormulaOptions, FormulaStores } from '../../types';
import { createFieldExtract } from './extract';
import { createEnrichField } from './enrichment';

const initialValues = new Map<HTMLElement, Record<string, unknown | unknown[]>>();
const initialValidity = new Map<HTMLElement, Record<string, FormulaError>>();
const initialEnrichment = new Map<HTMLElement, Record<string, Record<string, unknown>>>();

/**
 * Initialise the stores with data from the form, it will also use any default values provided
 * @param node
 * @param allGroups
 * @param stores
 * @param options
 */
export function getInitialFormValues<T extends Record<string, unknown | unknown[]>>(
  node: HTMLElement,
  allGroups: [string, FormEl[]][],
  stores: FormulaStores<T>,
  options: FormulaOptions,
) {
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
  stores.formValues.set({ ...formValues } as T);
  stores.initialValues.set({ ...formValues } as T);
  stores.validity.set({ ...validityValues });
  stores.isFormValid.set(Object.values({ ...validityValues }).every((v: FormulaError) => v.valid));
  stores.enrichment.set({ ...enrichmentValues });

  initialValues.set(node, { ...formValues });
  initialValidity.set(node, { ...validityValues });
  initialEnrichment.set(node, { ...enrichmentValues });
}

/**
 * Create the form reset method

 */
export function createReset<T extends Record<string, unknown | unknown[]>>(
  node: HTMLElement,
  allGroups: [string, FormEl[]][],
  stores: FormulaStores<T>,
  options: FormulaOptions,
) {
  /**
   * Resets the form to the initial values
   */
  return () => {
    const formValues = initialValues.get(node);
    const validityValues = initialValidity.get(node);
    const enrichment = initialEnrichment.get(node);

    stores.formValues.set(formValues as T);
    stores.validity.set(validityValues);
    stores.isFormValid.set(Object.values(validityValues).every((v: FormulaError) => v.valid));
    stores.enrichment.set(enrichment);
    // Also override touched and dirty
    stores.touched.set(Object.keys(initialValues).reduce((val, key) => ({ ...val, [key]: false }), {}));
    stores.dirty.set(Object.keys(initialValues).reduce((val, key) => ({ ...val, [key]: false }), {}));

    // Update the elements
    for (const [key, elements] of allGroups) {
      const extract = createFieldExtract(key, elements, options, stores);
      extract(elements[0], false, true);
    }
  };
}

export function cleanupDefaultValues(node: HTMLElement) {
  if (initialValues.has(node)) {
    initialValues.delete(node);
  }
  if (initialValidity.has(node)) {
    initialValidity.delete(node);
  }
  if (initialEnrichment.has(node)) {
    initialEnrichment.delete(node);
  }
}
