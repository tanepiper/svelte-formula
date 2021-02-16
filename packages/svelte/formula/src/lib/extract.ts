import { ExtractedFormInfo, FormEl } from '../types/forms';
import { checkValidity } from './errors';
import { ValidationRules } from '../types/validation';

/**
 * Generic handle for extracting data from an `<input>` or `<textarea>` element that
 * doesn't have a special case
 * @param name
 * @param element
 * @param groupElements
 * @param customValidators
 */
export function extractData(
  name: string,
  element: FormEl,
  groupElements: FormEl[],
  customValidators?: ValidationRules,
): ExtractedFormInfo {
  const validValue = element.value === '' || typeof element.value === 'undefined' ? '' : element.value;
  let value: unknown | unknown[] =
    groupElements.length > 1
      ? groupElements
          .map((v) => {
            if (v.id === element.id) {
              return validValue;
            }
            return v.value;
          })
          .filter((v) => v !== '')
      : validValue;

  if (['number', 'range'].includes(element.getAttribute('type'))) {
    if (Array.isArray(value)) {
      value = value.length > 0 ? value.map((v) => parseFloat(v)) : [];
    } else {
      value = value !== '' ? parseFloat(value as string) : null;
    }
  }

  const validity = checkValidity(element, value, customValidators);

  return {
    name,
    value,
    ...validity,
  };
}

/**
 * Extract the data from an `<input type="checkbox"> element - this returns a boolean value
 * if a single checkbox.  If multiple checkboxes are detected it returns an array value
 * @param name
 * @param element The element being checked
 * @param elements All elements from the name group
 * @param customValidators
 */
export function extractCheckbox(
  name: string,
  element: HTMLInputElement,
  elements: HTMLInputElement[],
  customValidators?: ValidationRules,
): ExtractedFormInfo {
  const value =
    elements.length > 1
      ? elements
          .map((e) =>
            e.id === element.id ? (element.checked && element.value) || null : (e.checked && e.value) || null,
          )
          .filter((v) => v !== null)
      : element.checked;
  const validity = checkValidity(element, value, customValidators);
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
 * @param name
 * @param el
 * @param customValidators
 */
export function extractRadio(
  name: string,
  el: HTMLInputElement,
  customValidators?: ValidationRules,
): ExtractedFormInfo {
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
 * @param name
 * @param el
 * @param customValidators
 */
export function extractSelect(
  name: string,
  el: HTMLSelectElement,
  customValidators?: ValidationRules,
): ExtractedFormInfo {
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
 * @param name
 * @param el
 * @param customValidators
 */
export function extractFile(name: string, el: HTMLInputElement, customValidators?: ValidationRules): ExtractedFormInfo {
  const value = el.files;
  const validity = checkValidity(el, value, customValidators);
  return {
    name,
    value,
    ...validity,
  };
}
