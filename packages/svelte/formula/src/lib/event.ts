import { Writable } from 'svelte/store';
import { FormEl, FormError, FormErrors } from '../types/forms';
import { extractCheckbox, extractData, extractRadio } from './extract';

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

export function createSubmitHandler(
  values: Writable<Record<string, unknown>>,
  submit: Writable<Record<string, unknown>>,
) {
  return (event: KeyboardEvent) => {
    values.subscribe((v) => {
      submit.set(v);
    })();
  };
}

export function createTouchHandler(el: FormEl, touched: Writable<Record<string, boolean>>) {
  function updateTouched(event: MouseEvent) {
    const name = el.getAttribute('name');
    touched.update((state) => ({ ...state, [name]: true }));
    el.removeEventListener('focus', updateTouched);
  }

  el.addEventListener('focus', updateTouched);
}
