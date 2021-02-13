import { createForm } from './lib/form';
import { writable } from 'svelte/store';
import { FormErrors, FormValues } from './types/forms';

/**
 * The forumla function returns a form object that can be bound to any HTML
 * element that contains form inputs.  Once bound you can get the current values
 *
 */
export function formula() {
  const formValues = writable<FormValues>({});
  const submitValues = writable<FormValues>({});
  const touched = writable<Record<string, boolean>>({});
  const validity = writable<FormErrors>({});
  const formValid = writable<boolean>(false);

  return {
    form: createForm(formValues, submitValues, validity, formValid, touched),
    formValues,
    submitValues,
    touched,
    validity,
    formValid,
  };
}
