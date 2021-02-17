import { FormEl, FormulaError, FormulaField } from '../types/forms';
import {
  createCheckboxExtract,
  createFieldExtract,
  createFileExtract,
  createRadioExtract,
  createSelectExtract,
} from './extract';
import { FormulaStores } from '../types/formula';
import { FormulaOptions } from '../types/options';

/**
 * Update the value and error stores, also update form validity
 * @param details
 * @param stores
 */
function valueUpdate(details: FormulaField, stores: FormulaStores): void {
  stores.formValues.update((state) => ({ ...state, [details.name]: details.value }));
  stores.validity.update((state) => {
    const result = {
      ...state,
      [details.name]: {
        valid: details.valid,
        invalid: !details.valid,
        errors: details.errors,
        message: details.message,
      },
    };
    stores.isFormValid.set(Object.values(result).every((v: FormulaError) => v.valid));
    return result;
  });
}

/**
 * Creates an event handler for the passed element with it's data handler
 * @param extractor
 * @param stores
 */
function createHandlerForData(extractor: any, stores: FormulaStores) {
  return (event: Event) => {
    const el = (event.currentTarget || event.target) as FormEl;
    valueUpdate(extractor(el), stores);
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
 */
export function createHandler(
  name: string,
  eventName: string,
  element: FormEl,
  groupElements: FormEl[],
  stores: FormulaStores,
  options: FormulaOptions,
): () => void {
  let extract;

  if (element instanceof HTMLSelectElement) {
    extract = createSelectExtract(name, options);
  } else {
    switch (element.type) {
      case 'checkbox':
        extract = createCheckboxExtract(name, groupElements, options);
        break;
      case 'radio':
        extract = createRadioExtract(name, options);
        break;
      case 'file':
        extract = createFileExtract(name, options);
        break;
      default:
        extract = createFieldExtract(name, groupElements, options);
    }
  }
  const handler = createHandlerForData(extract, stores);
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
export function createSubmitHandler(stores: FormulaStores): (event: Event) => void {
  return (): void => stores.formValues.subscribe((v) => stores.submitValues.set(v))();
}
