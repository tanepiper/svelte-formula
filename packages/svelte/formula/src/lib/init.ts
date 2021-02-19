import { FormEl, FormulaError, FormValues } from '../types/forms';
import { createFieldExtract } from './extract';
import { FormulaStores } from '../types/formula';
import { FormulaOptions } from '../types/options';
import { createEnrichField } from './enrichment';

const initialValues: FormValues = {};
const initialValidity: Record<string, FormulaError> = {};
const initialEnrichment: Record<string, Record<string, unknown>> = {};

/**
 * Initialise the stores with data from the form, it will also use any default values provided
 * @param allGroups
 * @param stores
 * @param options
 */
export function getInitialFormValues(allGroups: [string, FormEl[]][], stores: FormulaStores, options: FormulaOptions) {
  for (const [key, elements] of allGroups) {
    const extract = createFieldExtract(key, elements, options, stores);
    const { name, value, ...validity } = extract(elements[0], true);
    initialValues[key] = value;
    initialValidity[key] = validity;
    if (options?.enrich?.[key]) {
      const enrich = createEnrichField(key, options);
      initialEnrichment[key] = enrich(value);
    }
  }
  stores.formValues.set(initialValues);
  stores.initialValues.set(initialValues);
  stores.validity.set(initialValidity);
  stores.isFormValid.set(Object.values(initialValidity).every((v: FormulaError) => v.valid));
  stores.enrichment.set(initialEnrichment);
}

/**
 * Create the form reset method

 */
export function createReset(allGroups: [string, FormEl[]][], stores: FormulaStores, options: FormulaOptions) {
  /**
   * Resets the form to the initial values
   */
  return () => {
    stores.formValues.set(initialValues);
    stores.validity.set(initialValidity);
    stores.isFormValid.set(Object.values(initialValidity).every((v: FormulaError) => v.valid));
    stores.enrichment.set(initialEnrichment);
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
