import { Writable } from 'svelte/store';
import { FormEl, FormErrors, FormValues } from '../types/forms';
import { extractCheckbox, extractData } from './extract';

function initValues(
  details: any,
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

export function initFormValue(
  el: FormEl,
  values: Writable<FormValues>,
  errors: Writable<FormErrors>,
  touched: Writable<Record<string, boolean>>,
) {
  const details = extractData(el);
  initValues(details, values, errors, touched);
}

export function initCheckboxValue(
  el: HTMLInputElement,
  values: Writable<FormValues>,
  errors: Writable<FormErrors>,
  touched: Writable<Record<string, boolean>>,
) {
  const details = extractCheckbox(el);
  initValues(details, values, errors, touched);
}
