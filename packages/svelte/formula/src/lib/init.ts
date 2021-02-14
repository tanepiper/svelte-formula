import { Writable } from 'svelte/store';
import { FormEl, FormErrors, FormValues } from '../types/forms';
import { extractData } from './extract';

export function initValues(
  el: FormEl,
  values: Writable<FormValues>,
  errors: Writable<FormErrors>,
  touched: Writable<Record<string, boolean>>,
) {
  const details = extractData(el);

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
