import { Writable } from 'svelte/store';
import { ExtractedFormInfo, FormEl, FormErrors, FormulaError } from '../types/forms';
import { extractCheckbox, extractData, extractRadio, extractSelect } from './extract';
import { ValidationRules } from '../types/validation';

/**
 * Update the value and error stores, also update form validity
 * @param details
 * @param values
 * @param errors
 * @param isValid
 */
function valueUpdate(
  details: ExtractedFormInfo,
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
) {
  values.update((state) => ({ ...state, [details.name]: details.value }));
  errors.update((state) => {
    const result = {
      ...state,
      [details.name]: {
        valid: details.valid,
        invalid: !details.valid,
        errors: details.errors,
        message: details.message,
      },
    };
    isValid.set(Object.values(result).every((v: FormulaError) => v.valid));
    return result;
  });
}

/**
 * Create a generic value event handler
 * @param values
 * @param errors
 * @param isValid
 * @param updateMultiple
 * @param customValidators
 */
export function createValueHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
  updateMultiple?: any,
  customValidators?: ValidationRules,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as FormEl;
    const details = extractData(el, updateMultiple, customValidators);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for checkbox elements
 * @param updateMultiple,
 * @param values
 * @param errors
 * @param isValid
 * @param customValidators
 */
export function createCheckHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
  updateMultiple?: any,
  customValidators?: ValidationRules,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLInputElement;
    const details = extractCheckbox(el, updateMultiple, customValidators);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for radio elements
 * @param values
 * @param errors
 * @param isValid
 * @param customValidators
 */
export function createRadioHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
  customValidators?: ValidationRules,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLInputElement;
    const details = extractRadio(el, customValidators);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for select elements
 * @param values
 * @param errors
 * @param isValid
 * @param customValidators
 */
export function createSelectHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
  customValidators?: ValidationRules,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLSelectElement;
    const details = extractSelect(el, customValidators);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param formValues
 * @param submitValues
 */
export function createSubmitHandler(
  formValues: Writable<Record<string, unknown>>,
  submitValues: Writable<Record<string, unknown>>,
) {
  return (): void => formValues.subscribe((v) => submitValues.set(v))();
}
