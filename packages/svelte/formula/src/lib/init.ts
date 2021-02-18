import { writable } from 'svelte/store';
import { FormEl, FormulaError, FormulaField, FormValues } from '../types/forms';
import {
  createCheckboxExtract,
  createFieldExtract,
  createFileExtract,
  createRadioExtract,
  createSelectExtract,
} from './extract';
import { FormulaStores } from '../types/formula';
import { FormulaOptions } from '../types/options';
import { createEnrichField } from './enrichment';

/**
 * Get the initial value from the passed elements
 * @param name
 * @param elements
 * @param options
 */
export function getInitialValue(name: string, elements: FormEl[], options: FormulaOptions): FormulaField {
  const el = elements[0];

  let handler;
  if (el instanceof HTMLSelectElement) {
    handler = createSelectExtract(name, options);
  } else {
    switch (el.type) {
      case 'checkbox': {
        handler = createCheckboxExtract(name, elements, options);
        break;
      }
      case 'file': {
        handler = createFileExtract(name, options);
        break;
      }
      case 'radio': {
        handler = createRadioExtract(name, options);
        break;
      }
      default: {
        handler = createFieldExtract(name, elements, options);
      }
    }
  }

  return handler(el);
}

export function initialValues(allGroups: [string, FormEl[]][], stores: FormulaStores, options: FormulaOptions) {
  const finalResult: FormValues = {};
  const finalValidity: Record<string, FormulaError> = {};
  const finalEnrichment: Record<string, Record<string, unknown>> = {};

  for (const [key, elements] of allGroups) {
    const details = getInitialValue(key, elements, options);
    finalResult[key] = details.value;
    finalValidity[key] = {
      invalid: details.invalid,
      valid: details.valid,
      message: details.message,
      errors: details.errors,
    };
    if (options?.enrich?.[key]) {
      const enrich = createEnrichField(key, options);
      finalEnrichment[key] = enrich(details.value);
    }
  }
  stores.formValues.set(finalResult);
  stores.validity.set(finalValidity);
  stores.isFormValid.set(Object.values(finalValidity).every((v: FormulaError) => v.valid));
  stores.enrichment.set(finalEnrichment);
}

/**
 * Create the stores for the instance
 */
export function createStores(): FormulaStores {
  return {
    formValues: writable<FormValues>({}),
    submitValues: writable<FormValues>({}),
    touched: writable<Record<string, boolean>>({}),
    dirty: writable<Record<string, boolean>>({}),
    validity: writable<Record<string, FormulaError>>({}),
    formValidity: writable<Record<string, string>>({}),
    isFormValid: writable<boolean>(false),
    enrichment: writable<Record<string, Record<string, unknown>>>({}),
  };
}
