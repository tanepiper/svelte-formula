import { ExtractedFormInfo, FormEl } from '../types/forms';
import { extractErrors } from './errors';
import { isMultiCheckbox } from 'packages/svelte/formula/src/lib/dom';

/**
 * Generic handle for extracting data from an `<input>` or `<textarea>` element that
 * doesn't have a special case
 * @param el
 */
export function extractData(el: FormEl) {
  return {
    name: el.getAttribute('name') as string,
    value: el.value,
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  };
}

/**
 * Extract the data from an `<input type="checkbox"> element - this returns a boolean value
 * if a single checkbox.  If multiple checkboxes are detected it returns an array value
 * @param el
 * @param updateMultiple
 */
export function extractCheckbox(el: HTMLInputElement, updateMultiple?: any): ExtractedFormInfo {
  return {
    name: el.getAttribute('name') as string,
    value: updateMultiple ? updateMultiple(el.checked, el.value) : el.checked,
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  };
}

/**
 * Extract the data from an `<input type="radio">` element, returning the value
 * only for checked items, this works both with initial values and when the user
 * selects a value
 * @param el
 */
export function extractRadio(el: HTMLInputElement): ExtractedFormInfo {
  return {
    name: el.getAttribute('name') as string,
    value: el.checked ? el.value : '',
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  };
}

/**
 * Extract the data from a `<select>` element - here we can support single values
 * or if the field is multiple it will return an array of values
 * @param el
 */
export function extractSelect(el: HTMLSelectElement): ExtractedFormInfo {
  /**
   * As the `HTMLCollectionOf` is not iterable, we have to loop over it with
   * a for loop instead
   * @private
   * @internal
   * @param collection
   */
  function getMultiValue(collection: HTMLCollectionOf<HTMLOptionElement>) {
    const value = [];
    for (let i = 0; i < collection.length; i++) {
      value.push(collection[i].value);
    }
    return value;
  }

  return {
    name: el.getAttribute('name') as string,
    value: el.multiple ? getMultiValue(el.selectedOptions) : el.value,
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  };
}
