import { writable } from 'svelte/store';
import { ExtractedFormInfo, FormEl, FormulaError, FormValues } from '../types/forms';
import { extractCheckbox, extractData, extractFile, extractRadio, extractSelect } from './extract';
import { FormulaStores } from '../types/formula';
import { ValidationFn } from '../types/validation';

/**
 * Initialise the value of the store with the details provided
 * @param details
 * @param stores
 */
function initValues(details: ExtractedFormInfo, stores: FormulaStores) {
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
 * Create the initial value type for the current element, handling cases for multiple
 * values
 * @param name
 * @param el
 * @param groupElements
 * @param stores
 * @param customValidators
 */
export function createInitialValues(
  name: string,
  el: FormEl,
  groupElements: FormEl[],
  stores: FormulaStores,
  customValidators: Record<string, ValidationFn>,
) {
  if (el instanceof HTMLSelectElement) {
    initValues(extractSelect(name, el as HTMLSelectElement, customValidators), stores);
  } else {
    switch (el.type) {
      case 'checkbox': {
        initValues(
          extractCheckbox(name, el as HTMLInputElement, groupElements as HTMLInputElement[], customValidators),
          stores,
        );
        break;
      }
      case 'file': {
        initValues(extractFile(name, el as HTMLInputElement, customValidators), stores);
        break;
      }
      case 'radio': {
        initValues(extractRadio(name, el as HTMLInputElement), stores);
        break;
      }
      default: {
        initValues(extractData(name, el, groupElements, customValidators), stores);
      }
    }
  }
}

/**
 * Get the initial value from the passed elements
 * @param name
 * @param elements
 * @param stores
 * @param validations
 */
export function getInitialValue(
  name: string,
  elements: FormEl[],
  stores: FormulaStores,
  validations: Record<string, ValidationFn>,
) {
  elements.forEach((el) => createInitialValues(name, el, elements, stores, validations));
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
