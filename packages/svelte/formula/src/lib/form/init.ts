import { FormEl, FormulaError, FormulaOptions, FormulaStores } from '../../types';
import { createFieldExtract } from './extract';
import { createEnrichField } from './enrichment';

const initialValues = new WeakMap<FormulaStores, Record<string, unknown | unknown[]>>();
const initialValidity = new WeakMap<FormulaStores, Record<string, FormulaError>>();
const initialEnrichment = new WeakMap<FormulaStores, Record<string, Record<string, unknown>>>();

/**
 * Initialise the stores with data from the form, it will also use any default values provided
 * @param allGroups
 * @param stores
 * @param options
 */
export function getInitialFormValues(allGroups: [string, FormEl[]][], stores: FormulaStores, options: FormulaOptions) {
  const formValues: Record<string, unknown | unknown[]> = {};
  const validityValues: Record<string, FormulaError> = {};
  const enrichmentValues: Record<string, Record<string, unknown>> = {};
  for (const [key, elements] of allGroups) {
    const extract = createFieldExtract(key, elements, options, stores);
    const { name, value, ...validity } = extract(elements[0], true);
    formValues[key] = value;
    validityValues[key] = validity;
    if (options?.enrich?.[key]) {
      const enrich = createEnrichField(key, options);
      enrichmentValues[key] = enrich(value);
    }
  }
  stores.formValues.set(formValues);
  stores.initialValues.set(formValues);
  stores.validity.set(validityValues);
  stores.isFormValid.set(Object.values(validityValues).every((v: FormulaError) => v.valid));
  stores.enrichment.set(enrichmentValues);

  initialValues.set(stores, formValues);
  initialValidity.set(stores, validityValues);
  initialEnrichment.set(stores, enrichmentValues);
}

/**
 * Create the form reset method

 */
export function createReset(
  allGroups: [string, FormEl[]][],
  stores: FormulaStores,
  options: FormulaOptions,
  isGroup?: boolean,
) {
  /**
   * Resets the form to the initial values
   */
  return () => {
    const formValues = initialValues.get(stores);
    const validityValues = initialValidity.get(stores);
    const enrichment = initialEnrichment.get(stores);

    stores.formValues.set(formValues);
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
