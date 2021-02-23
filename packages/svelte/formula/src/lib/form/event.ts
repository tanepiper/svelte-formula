import { FormEl, FormulaError, FormulaField, FormulaOptions, FormulaStores } from '../../types';
import { createFieldExtract } from './extract';
import { createEnrichField } from './enrichment';

/**
 * Update the value and error stores, also update form validity
 * @param details
 * @param stores
 * @param enrich
 */
export function valueUpdate<T extends Record<string, unknown | unknown[]>>(
  details: FormulaField,
  stores: FormulaStores<T>,
  enrich?: (value: unknown | unknown[]) => Record<string, unknown>,
): void {
  const { name, value, ...validity } = details;
  stores.formValues.update((state) => ({ ...state, [name]: value }));
  stores.validity.update((state) => {
    const result = {
      ...state,
      [name]: validity,
    };
    stores.isFormValid.set(Object.values(result).every((v: FormulaError) => v.valid));
    if (enrich) {
      stores.enrichment.set({ [name]: enrich(value) });
    }
    return result;
  });
}

/**
 * Creates an event handler for the passed element with it's data handler
 * @param extractor
 * @param stores
 * @param enrich
 */
function createHandlerForData<T extends Record<string, unknown | unknown[]>>(
  extractor: (el: FormEl) => FormulaField,
  stores: FormulaStores<T>,
  enrich?: (value: unknown | unknown[]) => Record<string, unknown>,
) {
  return (event: Event) => {
    const el = (event.currentTarget || event.target) as FormEl;
    valueUpdate(extractor(el), stores, enrich);
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
 * @param isGroup
 */
export function createHandler<T extends Record<string, unknown | unknown[]>>(
  name: string,
  eventName: string,
  element: FormEl,
  groupElements: FormEl[],
  stores: FormulaStores<T>,
  options: FormulaOptions,
  isGroup?: boolean,
): () => void {
  const extract = createFieldExtract(name, groupElements, options, stores);
  let enrich;
  if (options?.enrich?.[name]) {
    enrich = createEnrichField(name, options);
  }

  const handler = createHandlerForData(extract, stores, enrich);
  element.addEventListener(eventName, handler);

  return () => {
    element.removeEventListener(eventName, handler);
  };
}

/**
 * Create a handler for a form element submission, when called it copies the contents
 * of the current value store to the submit store and then unsubscribes
 * @param stores
 */
export function createSubmitHandler<T extends Record<string, unknown | unknown[]>>(
  stores: FormulaStores<T>,
): (event: Event) => void {
  return (): void => stores.formValues.subscribe((v) => stores.submitValues.set(v))();
}
