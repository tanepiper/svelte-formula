import { Writable } from 'svelte/store';
import { FormEl, FormError, FormErrors } from '../types/forms';
import { extractCheckbox, extractData, extractRadio, extractSelect } from './extract';

function valueUpdate(
  details: any,
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
    isValid.set(Object.values(result).every((v: FormError) => v.valid));
    return result;
  });
}

/**
 * Create a generic value event handler
 * @param values
 * @param errors
 * @param isValid
 */
export function createValueHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as FormEl;
    const details = extractData(el);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for checkbox elements
 * @param values
 * @param errors
 * @param isValid
 */
export function createCheckHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLInputElement;
    const details = extractCheckbox(el);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for radio elements
 * @param values
 * @param errors
 * @param isValid
 */
export function createRadioHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLInputElement;
    const details = extractRadio(el);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for select elements
 * @param values
 * @param errors
 * @param isValid
 */
export function createSelectHandler(
  values: Writable<Record<string, unknown>>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLSelectElement;
    const details = extractSelect(el);
    valueUpdate(details, values, errors, isValid);
  };
}

/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param values
 * @param submit
 */
export function createSubmitHandler(
  values: Writable<Record<string, unknown>>,
  submit: Writable<Record<string, unknown>>,
) {
  return (): void => values.subscribe((v) => submit.set(v))();
}

/**
 * Create a handler for an element for when it's focused, when it is called update the
 * touched store and unsubscribe immediately
 * @param el
 * @param touched
 */
export function createTouchHandler(el: FormEl, touched: Writable<Record<string, boolean>>) {
  function updateTouched(event: MouseEvent) {
    const name = el.getAttribute('name');
    touched.update((state) => ({ ...state, [name]: true }));
    el.removeEventListener('focus', updateTouched);
  }

  el.addEventListener('focus', updateTouched);
}
