import { createForm } from './lib/form';
import { writable } from 'svelte/store';
import { FormErrors, FormValues } from './types/forms';

export { FormValues, FormErrors };

/**
 * The `formula` function returns a form object that can be bound to any HTML
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
    /**
     * The form action, this is used with Sveltes `use` directive which attaches to any element
     * and handles internal form state creation
     */
    form: createForm(formValues, submitValues, validity, formValid, touched),
    /**
     * The store with the current form values
     * @typedef Writable<FormValues>
     */
    formValues,
    /**
     * The store with the form values at time of form submission
     * @typedef Writable<FormValues>
     */
    submitValues,
    /**
     * Store with the current touched state of elements
     * @typedef Writable<Record<string, boolean>>
     */
    touched,
    /**
     * The store with the current form errors
     * @typedef Writable<FormErrors>
     */
    validity,
    /**
     * Store containing the current overall validity state of the form
     * @typedef Writable<boolean>
     */
    formValid,
  };
}
