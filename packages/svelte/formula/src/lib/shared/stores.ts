import { writable } from 'svelte/store';
import { BeakerStores, FormulaError, FormulaOptions, FormulaStores } from '../../types';

/**
 * Function to create initial state values for the store using any passed default values, this is not the final initial
 * state, but is used when the stores are created to ensure required keys are available with any initial state, even if
 * an empty string.
 *
 * This avoids the need for the `?.` operator in code since we can guarantee the key on first subscription this way
 *
 * @private
 * @internal
 *
 * @param options Initial options to use
 * @param initialData
 */
function createFirstState<T extends Record<string, unknown | unknown[]>>(options?: FormulaOptions, initialData?: T) {
  let initialValues = options?.defaultValues || {};
  initialValues = { ...initialValues, ...initialData };
  const initialKeys = Object.keys(initialValues);

  // Generate from default values any initial touched and dirty states
  const initialFieldState = initialKeys.reduce((val, key) => ({ ...val, [key]: false }), {});
  // Generate from default values any initial initial validity
  const initialValidity = initialKeys.reduce(
    (val, key) => ({
      ...val,
      [key]: {
        valid: true,
        invalid: false,
        message: '',
        errors: {},
      },
    }),
    {},
  );
  // Generate from default values any initial form validity
  const initialFormValidity = Object.keys(options?.formValidators || {}).reduce(
    (val, key) => ({
      ...val,
      [key]: '',
    }),
    {},
  );
  // Generate from default values any initial enrichment
  const initialEnrichment = Object.entries(options?.enrich || {}).reduce((value, [key, fns]) => {
    return {
      ...value,
      [key]: Object.entries(fns).reduce(
        (v, [k, fn]) => ({
          ...v,
          [k]: options?.defaultValues?.[key] ? fn(options?.defaultValues?.[key]) : undefined,
        }),
        {},
      ),
    };
  }, {});
  return {
    initialValues,
    initialKeys,
    initialFieldState,
    initialValidity,
    initialFormValidity,
    initialEnrichment,
  };
}

/**
 * Create the stores for the the form instance, these can be set using the `defaultValue` property
 * of FormulaOptions
 * @param options
 * @param initialData
 *
 * @returns An object containing the stores for the form instance
 */
export function createFormStores<T extends Record<string, unknown | unknown[]>>(
  options?: FormulaOptions,
  initialData?: T,
): FormulaStores<T> {
  const initialStoreState = createFirstState<T>(options, initialData);
  return {
    formValues: writable<T>(initialStoreState.initialValues as T),
    submitValues: writable<T>({} as T),
    initialValues: writable<T>(initialStoreState.initialValues as T),
    touched: writable<Record<string, boolean>>(initialStoreState.initialFieldState),
    dirty: writable<Record<string, boolean>>(initialStoreState.initialFieldState),
    validity: writable<Record<string, FormulaError>>(initialStoreState.initialValidity),
    formValidity: writable<Record<string, string>>(initialStoreState.initialFormValidity),
    isFormValid: writable<boolean>(false),
    isFormReady: writable<boolean>(false),
    enrichment: writable<Record<string, Record<string, unknown>>>(initialStoreState.initialEnrichment),
  };
}

/**
 * Create a group store which contains arrays of form store values
 */
export function createGroupStores<T extends Record<string, unknown | unknown[]>>(
  options?: FormulaOptions,
): BeakerStores<T> {
  return {
    formValues: writable<T[]>([]),
    submitValues: writable<T[]>([]),
    initialValues: writable<T[]>([]),
    touched: writable<Record<string, boolean>[]>([]),
    dirty: writable<Record<string, boolean>[]>([]),
    validity: writable<Record<string, FormulaError>[]>([]),
    formValidity: writable<Record<string, string>>({}),
    isFormValid: writable<boolean>(false),
    isFormReady: writable<boolean>(false),
    enrichment: writable<Record<string, Record<string, unknown>>[]>([]),
  };
}
