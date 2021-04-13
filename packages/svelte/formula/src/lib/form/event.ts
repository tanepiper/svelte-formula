import {
  FormEl,
  FormulaError,
  FormulaField,
  FormulaOptions,
  FormulaStores,
  FormulaValue,
  FormulaValueDefault,
  ValidationFn,
} from '../../types';
import { createFieldExtract } from './extract';
import { createEnrichField } from './enrichment';
import { get } from 'svelte/store';

/**
 * Do validation on the form and set the form validity state and set the form to invalid if there
 * are any form validations
 * @param formValidators
 * @param stores
 */
function formValidation(formValidators: Record<string, ValidationFn>, stores: FormulaStores) {
  const currentValues = get(stores.formValues);
  stores.formValidity.set({});
  const validators = Object.entries(formValidators);

  const invalidStates = {};
  for (let i = 0; i < validators.length; i++) {
    const [name, validator] = validators[i];
    const invalid = validator(currentValues);
    if (invalid !== null) {
      invalidStates[name] = invalid;
    }
  }

  if (Object.keys(invalidStates).length > 0) {
    stores.formValidity.set(invalidStates);
    stores.isFormValid.set(false);
  }
}

/**
 * Update the value and error stores, also update form validity
 * @param details
 * @param stores
 * @param options
 * @param hiddenFields
 * @param enrich
 */
export function valueUpdate(
  details: FormulaField,
  stores: FormulaStores,
  options: FormulaOptions,
  hiddenFields: Map<string, HTMLInputElement[]>,
  enrich?: (value: unknown | unknown[]) => Record<string, unknown>,
): void {
  const { name, value, ...validity } = details;

  stores.formValues.update((state) => ({ ...state, [name]: value }));
  if (hiddenFields.size) {
    stores.formValues.update((state) => {
      hiddenFields.forEach(
        (group, name) => (state[name] = group.length > 1 ? group.map((e) => e.value) : group[0].value),
      );
      return state;
    });
  }
  // Update validity and form validity
  stores.validity.update((state) => ({ ...state, [name]: validity }));
  stores.isFormValid.set(Object.values(get(stores.validity)).every((v: FormulaError) => v.valid));
  if (options?.formValidators) {
    formValidation(options.formValidators, stores);
  }
  if (enrich) {
    stores.enrichment.set({ [name]: enrich(value) });
  }
  if (typeof options?.postChanges === 'function') {
    options?.postChanges(get(stores.formValues));
  }
}

/**
 * Creates an event handler for the passed element with it's data handler
 * @param extractor
 * @param stores
 * @param options
 * @param hiddenFields
 * @param enrich
 */
function createHandlerForData<T extends FormulaValue = FormulaValueDefault>(
  extractor: (el: FormEl) => FormulaField,
  stores: FormulaStores<T>,
  options: FormulaOptions,
  hiddenFields: Map<string, HTMLInputElement[]>,
  enrich?: (value: unknown | unknown[]) => Record<string, unknown>,
) {
  return (event: Event) => {
    if (typeof options?.preChanges === 'function') options.preChanges();
    // Allow elements to update by letting the browser do a tick
    setTimeout(() => {
      const el = (event.currentTarget || event.target) as FormEl;
      valueUpdate(extractor(el), stores, options, hiddenFields, enrich);
    }, 0);
  };
}

/**
 * Create a handler for the passed element
 * @param name
 * @param eventName
 * @param element
 * @param groupElements
 * @param stores
 * @param options
 * @param hiddenGroups
 */
export function createHandler<T extends FormulaValue = FormulaValueDefault>(
  name: string,
  eventName: string,
  element: FormEl,
  groupElements: FormEl[],
  stores: FormulaStores<T>,
  options: FormulaOptions,
  hiddenGroups: Map<string, HTMLInputElement[]>,
): () => void {
  const extract = createFieldExtract(name, groupElements, options, stores);
  let enrich;
  if (options?.enrich?.[name]) enrich = createEnrichField(name, options);
  const handler = createHandlerForData(extract, stores, options, hiddenGroups, enrich);
  element.addEventListener(eventName, handler);
  return () => element.removeEventListener(eventName, handler);
}

/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param stores
 * @param form
 */
export function createSubmitHandler<T extends FormulaValue = FormulaValueDefault>(
  stores: FormulaStores<T>,
  form: HTMLFormElement,
): (event: Event) => void {
  return (): void => {
    if (!form.noValidate) form.reportValidity();
    stores.formValues.subscribe((v) => stores.submitValues.set(v))();
  };
}
