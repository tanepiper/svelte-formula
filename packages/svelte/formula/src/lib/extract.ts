import { FormEl, FormulaField } from '../types/forms';
import { createValidationChecker } from './errors';
import { FormulaOptions } from '../types/options';

/**
 * Create a data handler for any type of input field
 * @param name
 * @param elementGroup
 * @param options
 */
export function createFieldExtract(name: string, elementGroup: FormEl[], options: FormulaOptions) {
  const validator = createValidationChecker(name, options);

  return (element: HTMLInputElement): FormulaField => {
    const validValue =
      element.value === '' || element.value === null || typeof element.value === 'undefined' ? '' : element.value;
    let value: unknown | unknown[] =
      elementGroup.length > 1
        ? elementGroup.map((v) => (v.id === element.id ? validValue : v.value)).filter((v) => v !== '')
        : validValue;

    // Parse number values
    if (['number', 'range'].includes(element.getAttribute('type'))) {
      if (Array.isArray(value)) {
        value = value.length > 0 ? value.map((v) => parseFloat(v)) : [];
      } else {
        value = value !== '' ? parseFloat(value as string) : null;
      }
    }

    return {
      name,
      value,
      ...validator(element, value),
    };
  };
}

/**
 * Create a data handler for checkbox fields
 * @param name
 * @param elementGroup
 * @param options
 */
export function createCheckboxExtract(name: string, elementGroup: FormEl[], options: FormulaOptions) {
  const validator = createValidationChecker(name, options);
  return (element: HTMLInputElement) => {
    const value =
      elementGroup.length > 1
        ? elementGroup
            .map((e: HTMLInputElement) =>
              e.id === element.id ? (element.checked && element.value) || null : (e.checked && e.value) || null,
            )
            .filter((v) => v !== null)
        : element.checked;
    return {
      name,
      value,
      ...validator(element, value),
    };
  };
}

/**
 * Create a data handler for radio groups
 * @param name
 * @param options
 */
export function createRadioExtract(name: string, options: FormulaOptions) {
  const validator = createValidationChecker(name, options);
  return (element: HTMLInputElement) => {
    const value = element.checked ? element.value : '';
    return {
      name,
      value,
      ...validator(element, value),
    };
  };
}

/**
 * Create a data handler for select fields
 * @param name
 * @param options
 */
export function createSelectExtract(name: string, options: FormulaOptions) {
  const validator = createValidationChecker(name, options);

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

  return (element: HTMLSelectElement) => {
    const value = element.multiple ? getMultiValue(element.selectedOptions) : element.value;
    return {
      name,
      value,
      ...validator(element, value),
    };
  };
}

/**
 * Create a data handler for form fields
 * @param name
 * @param options
 */
export function createFileExtract(name: string, options: FormulaOptions) {
  const validator = createValidationChecker(name, options);
  return (element: HTMLInputElement) => {
    const value = element.files;
    return {
      name,
      value,
      ...validator(element, value),
    };
  };
}
