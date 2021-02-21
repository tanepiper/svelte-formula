import { FormEl, FormulaField, FormulaOptions, FormulaStores } from '../../types';
import { createValidationChecker } from './errors';
import { get } from 'svelte/store';

/**
 * As the `HTMLCollectionOf` is not iterable, we have to loop over it with
 * a for loop instead
 * @private
 * @internal
 * @param collection
 */
function getMultiSelectOptionValues(collection: HTMLCollectionOf<HTMLOptionElement>): string[] {
  const value = [];
  for (let i = 0; i < collection.length; i++) {
    if (collection[i].selected) {
      value.push(collection[i].value);
    }
  }
  return value;
}

/**
 * Sets the element value
 * @param element
 * @param value
 * @param isMultiValue
 * @param elementGroup
 */
function setElementValue(element: FormEl, value: unknown | unknown[], isMultiValue: boolean, elementGroup: FormEl[]) {
  if (isMultiValue) {
    elementGroup.forEach((el, i) => {
      if (el.type === 'checkbox') {
        (el as HTMLInputElement).checked = (value as string[]).includes(el.value);
      } else {
        (el as HTMLInputElement).value = value[i] as string;
      }
    });
  } else {
    if (element instanceof HTMLSelectElement) {
      for (let i = 0; i < element.options.length; i++) {
        const el = element.options[i];
        el.selected = (value as unknown[]).includes(el.value);
      }
    } else if (element.type === 'checkbox') {
      elementGroup.forEach((el) => {
        (el as HTMLInputElement).checked = value === el.value;
      });
    } else if (element.type === 'radio') {
      elementGroup.forEach((el) => {
        (el as HTMLInputElement).checked = value === el.value;
      });
    } else if (element.type === 'file') {
      (element as HTMLInputElement).files = value instanceof FileList ? value : null;
    } else {
      element.value = value as string;
    }
  }
}

/**
 * Get the value or values from an element
 * @param element
 * @param isMultiValue
 * @param elementGroup
 */
function getElementValues(element: FormEl, isMultiValue: boolean, elementGroup: FormEl[]): unknown | unknown[] {
  let elValue;
  if (element instanceof HTMLSelectElement) {
    elValue = element.multiple ? getMultiSelectOptionValues(element.options) : element.value || null;
  } else {
    switch (element.type) {
      case 'number':
      case 'range': {
        elValue = isMultiValue
          ? elementGroup
              .map((v) => (v.id === element.id ? parseFloat(element.value) : parseFloat(v.value)))
              .filter((v) => !isNaN(v))
          : (() => {
              const val = parseFloat(element.value);
              return !isNaN(val) ? val : null;
            })();
        break;
      }
      case 'checkbox': {
        elValue = isMultiValue
          ? elementGroup
              .map((e: HTMLInputElement) => {
                return e.id === element.id
                  ? (element as HTMLInputElement).checked && element.value
                  : e.checked && e.value;
              })
              .filter(Boolean)
          : (element as HTMLInputElement).checked;
        break;
      }
      case 'radio': {
        elValue = (element as HTMLInputElement).checked ? element.value : null;
        break;
      }
      case 'file': {
        elValue = (element as HTMLInputElement).files;
        break;
      }
      default: {
        elValue = isMultiValue
          ? elementGroup.map((v) => (v.id === element.id ? element.value : v.value))
          : element.value || null;
      }
    }
  }
  return elValue;
}

/**
 * Create a data handler for any type of input field
 * @param name
 * @param elementGroup
 * @param options
 * @param stores
 */
export function createFieldExtract(
  name: string,
  elementGroup: FormEl[],
  options: FormulaOptions,
  stores: FormulaStores,
) {
  const validator = createValidationChecker(name, options);
  const isMultiValue =
    (() => {
      if (elementGroup[0].type === 'radio') {
        return false;
      }
      return !(elementGroup[0] as HTMLSelectElement).multiple;
    })() && elementGroup.length > 1;

  /**
   * Function called on every element update, can also be called at initial value
   * Welcome to edge-case hell
   */
  return (element: FormEl, isInit?: boolean, isReset?: boolean): FormulaField => {
    let value;
    if (isInit && options?.defaultValues?.[name]) {
      value = isMultiValue ? options?.defaultValues?.[name] || [] : options?.defaultValues?.[name] || '';
    } else {
      const storeValue = get(stores.formValues)?.[name];
      value = storeValue ? storeValue : isMultiValue ? [] : '';
    }
    if (!isReset) {
      const elValue = getElementValues(element, isMultiValue, elementGroup);
      if (isInit && (isMultiValue || element.type === 'select-multiple')) {
        value = (elValue as unknown[]).length === 0 ? value : elValue;
      } else if (!isReset && elValue !== null) {
        value = elValue;
      }
    }
    if (isInit || isReset) {
      setElementValue(element, value, isMultiValue, elementGroup);
    }

    return {
      name,
      value,
      ...validator(element, value),
    };
  };
}
