import { createForm } from './lib/form';
import { writable } from 'svelte/store';

export function formula() {

  const values = writable({});
  const isValid = writable(false);

  return {
    form: createForm(values, isValid),
    values: values,
    isValid: isValid
  };
}
