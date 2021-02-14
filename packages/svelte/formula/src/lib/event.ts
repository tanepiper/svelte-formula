import { Writable } from 'svelte/store';
import { FormEl, FormError, FormErrors } from '../types/forms';
import { extractCheckbox, extractData } from './extract';

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
    const el = (event.currentTarget || event.target) as FormEl;
    const details = extractCheckbox(el as HTMLInputElement);
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
