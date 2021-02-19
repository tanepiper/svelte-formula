import { writable } from 'svelte/store';
import { FormulaOptions } from '../types/options';
import { FormulaError, FormValues } from '../types/forms';
import { FormulaStores } from '../types/formula';

/**
 * Create the stores for the the form instance, these can be set using the `defaultValue` property
 * of FormulaOptions
 * @param options
 *
 * @returns An object containing the stores for the form instance
 */
export function createStores(options?: FormulaOptions): FormulaStores {
  const initialKeys = Object.keys(options?.defaultValues || {});
  const initialStates = initialKeys.reduce((val, key) => ({ ...val, [key]: false }), {});
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
  const initialFormValidity = Object.keys(options?.formValidators || {}).reduce(
    (val, key) => ({
      ...val,
      [key]: '',
    }),
    {},
  );
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
    formValues: writable<FormValues>(options?.defaultValues || {}),
    submitValues: writable<FormValues>({}),
    initialValues: writable<FormValues>(options?.defaultValues || {}),
    touched: writable<Record<string, boolean>>(initialStates),
    dirty: writable<Record<string, boolean>>(initialStates),
    validity: writable<Record<string, FormulaError>>(initialValidity),
    formValidity: writable<Record<string, string>>(initialFormValidity),
    isFormValid: writable<boolean>(false),
    isFormReady: writable<boolean>(false),
    enrichment: writable<Record<string, Record<string, unknown>>>(initialEnrichment),
  };
}
