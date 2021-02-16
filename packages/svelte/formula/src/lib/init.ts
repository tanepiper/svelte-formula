import { writable, Writable } from 'svelte/store';
import { ExtractedFormInfo, FormEl, FormErrors, FormulaError, FormValues } from '../types/forms';
import { extractCheckbox, extractData, extractRadio, extractSelect } from './extract';
import { hasMultipleNames, isMultiCheckbox } from './fields';
import { checkboxMultiUpdate, inputMultiUpdate } from './multi-value';
import { FormulaStores } from 'packages/svelte/formula/src/types/formula';

/**
 * Initialise the value of the store with the details provided
 * @param details
 * @param values
 * @param errors
 * @param touched
 */
function initValues(
  details: ExtractedFormInfo,
  values: Writable<FormValues>,
  errors: Writable<FormErrors>,
  touched: Writable<Record<string, boolean>>,
) {
  values.update((state) => ({ ...state, [details.name]: details.value }));
  errors.update((state) => ({
    ...state,
    [details.name]: {
      valid: details.valid,
      invalid: !details.valid,
      message: details.message,
      errors: details.errors,
    },
  }));
  touched.update((state) => ({ ...state, [details.name]: false }));
}

/**
 * Create the initial value type for the current element, handling cases for multiple
 * values
 * @param el
 * @param allElements
 * @param values
 * @param errors
 * @param touched
 */
export function createInitialValues(
  el: FormEl,
  allElements: FormEl[],
  values: Writable<FormValues>,
  errors: Writable<FormErrors>,
  touched: Writable<Record<string, boolean>>,
) {
  let details: ExtractedFormInfo;
  if (el instanceof HTMLSelectElement) {
    details = extractSelect(el);
  } else if (el.type === 'radio') {
    details = extractRadio(el as HTMLInputElement);
  } else if (el.type === 'checkbox') {
    const name = el.getAttribute('name') as string;
    const isMultiple = isMultiCheckbox(name, allElements);
    let updateMultiple;
    if (isMultiple) {
      updateMultiple = checkboxMultiUpdate(name);
    }
    details = extractCheckbox(el as HTMLInputElement, updateMultiple);
  } else {
    const name = el.getAttribute('name') as string;
    const isMultiple = hasMultipleNames(name, allElements);
    let updateMultiple;
    if (isMultiple) {
      updateMultiple = inputMultiUpdate(name);
    }
    details = extractData(el, updateMultiple);
  }
  initValues(details, values, errors, touched);
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
    isFormValid: writable<boolean>(false)
  }
}
