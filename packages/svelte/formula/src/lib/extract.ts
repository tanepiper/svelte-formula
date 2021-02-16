import { ExtractedFormInfo, FormEl } from '../types/forms';
import { checkValidity } from './errors';
import { ValidationRules } from '../types/validation';

/**
 * Generic handle for extracting data from an `<input>` or `<textarea>` element that
 * doesn't have a special case
 * @param el
 * @param updateMultiple
 * @param customValidators
 */
export function extractData(el: FormEl, updateMultiple?: (id: string, value: unknown) => unknown[], customValidators?: ValidationRules): ExtractedFormInfo {
  const name = el.getAttribute('name') as string;

  let val;
  if (['number', 'range'].includes(el.getAttribute('type'))) {
    val = el.value === '' ? undefined : parseInt(el.value);
  } else {
    val = el.value;
  }
  const value = updateMultiple ? updateMultiple(el.id, val) : val;
  const validity = checkValidity(el, value, customValidators);

  return {
    name,
    value,
    ...validity,
  };
}

/**
 * Extract the data from an `<input type="checkbox"> element - this returns a boolean value
 * if a single checkbox.  If multiple checkboxes are detected it returns an array value
 * @param el
 * @param updateMultiple
 * @param customValidators
 */
export function extractCheckbox(
  el: HTMLInputElement,
  updateMultiple?: (checked: boolean, value: unknown) => unknown[],
  customValidators?: ValidationRules,
): ExtractedFormInfo {
  const name = el.getAttribute('name') as string;
  const value = updateMultiple ? updateMultiple(el.checked, el.value) : el.checked;
  const validity = checkValidity(el, value, customValidators);
  return {
    name,
    value,
    ...validity,
  };
}

/**
 * Extract the data from an `<input type="radio">` element, returning the value
 * only for checked items, this works both with initial values and when the user
 * selects a value
 * @param el
 * @param customValidators
 */
export function extractRadio(el: HTMLInputElement, customValidators?: ValidationRules): ExtractedFormInfo {
  const name = el.getAttribute('name') as string;
  const value = el.checked ? el.value : '';
  const validity = checkValidity(el, value, customValidators);
  return {
    name,
    value,
    ...validity,
  };
}

/**
 * Extract the data from a `<select>` element - here we can support single values
 * or if the field is multiple it will return an array of values
 * @param el
 * @param customValidators
 */
export function extractSelect(el: HTMLSelectElement, customValidators?: ValidationRules): ExtractedFormInfo {
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

  const name = el.getAttribute('name') as string;
  const value = el.multiple ? getMultiValue(el.selectedOptions) : el.value;
  const validity = checkValidity(el, value, customValidators);
  return {
    name,
    value,
    ...validity,
  };
}

/**
 * Extract data from the files
 * @param el
 * @param customValidators
 */
export function extractFile(el: HTMLInputElement, customValidators?: ValidationRules): ExtractedFormInfo {
  const name = el.getAttribute('name') as string;
  const value = el.files;
  const validity = checkValidity(el, value, customValidators);
  return {
    name,
    value,
    ...validity,
  };
}
