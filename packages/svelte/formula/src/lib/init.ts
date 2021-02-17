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

/**
 * Initialise the value of the store with the details provided
 * @param details
 * @param stores
 */
function initValues(details: FormulaField, stores: FormulaStores) {
  stores.formValues.update((state) => ({ ...state, [details.name]: details.value }));
  stores.validity.update((state) => ({
    ...state,
    [details.name]: {
      valid: details.valid,
      invalid: !details.valid,
      message: details.message,
      errors: details.errors,
    },
  }));
}

/**
 * Get the initial value from the passed elements
 * @param name
 * @param elements
 * @param stores
 * @param options
 */
export function getInitialValue(name: string, elements: FormEl[], stores: FormulaStores, options: FormulaOptions) {
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
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
    initValues(handler(el), stores);
  }
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
  };
}
