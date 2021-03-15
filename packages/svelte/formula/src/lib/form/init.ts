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
function getInitialFormValues<T extends Record<string, unknown | unknown[]>>(
  node: HTMLElement,
  allGroups: [string, FormEl[]][],
  stores: FormulaStores<T>,
  options: FormulaOptions,
  isSet?: boolean,
): [Record<string, unknown | unknown[]>, Record<string, FormulaError>, Record<string, Record<string, unknown>>] {
  const formValues: Record<string, unknown | unknown[]> = {};
  const validityValues: Record<string, FormulaError> = {};
  const enrichmentValues: Record<string, Record<string, unknown>> = {};
  for (const [key, elements] of allGroups) {
    const extract = createFieldExtract(key, elements, options, stores);
    const { name, value, ...validity } = extract(elements[0], !isSet);
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

  return [formValues, validityValues, enrichmentValues];
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
  const [formValues, validityValues, enrichmentValues] = getInitialFormValues(node, allGroups, stores, options);
  /**
   * Resets the form to the initial values
   */
  return (newOpts?: FormulaOptions) => {
    let resetValues = formValues;
    let resetValidity = validityValues;
    let resetEnrichment = enrichmentValues;
    let opts = options;
    if (newOpts) {
      const defaultValues = {
        ...Object.keys(resetValues).reduce((o, k) => {
          o[k] = '';
          return o;
        }, {}),
      };
      opts = { ...newOpts, defaultValues: { ...defaultValues, ...newOpts.defaultValues } };
      const [newFormValues, newValidity, newEnrichment] = getInitialFormValues(node, allGroups, stores, opts, true);
      resetValues = newFormValues;
      resetValidity = newValidity;
      resetEnrichment = newEnrichment;
    }

    stores.formValues.set(resetValues as T);
    stores.validity.set(resetValidity);
    stores.isFormValid.set(Object.values(resetValidity).every((v: FormulaError) => v.valid));
    stores.enrichment.set(resetEnrichment);
    // Also override touched and dirty
    stores.touched.set(Object.keys(resetValues).reduce((val, key) => ({ ...val, [key]: false }), {}));
    stores.dirty.set(Object.keys(resetValues).reduce((val, key) => ({ ...val, [key]: false }), {}));

    // Update the elements
    for (const [key, elements] of allGroups) {
      const extract = createFieldExtract(key, elements, options, stores);
      extract(elements[0], typeof newOpts !== undefined, typeof newOpts === undefined, opts);
    }
  };
}
