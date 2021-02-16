import { ExtractedFormInfo, FormEl, FormulaError } from '../types/forms';
import { extractCheckbox, extractData, extractFile, extractRadio, extractSelect } from './extract';
import { ValidationRules } from '../types/validation';
import { FormulaStores } from '../types/formula';

/**
 * Update the value and error stores, also update form validity
 * @param details
 * @param stores
 */
function valueUpdate(details: ExtractedFormInfo, stores: FormulaStores): void {
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
 * Create a generic value event handler
 * @param stores
 * @param updateMultiple
 * @param customValidators
 */
export function createValueHandler(
  stores: FormulaStores,
  updateMultiple?: (id: string, value: unknown) => unknown[],
  customValidators?: ValidationRules,
): (event: Event) => void {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as FormEl;
    const details = extractData(el, updateMultiple, customValidators);
    valueUpdate(details, stores);
  };
}

/**
 * Create a handler for checkbox elements
 * @param stores
 * @param updateMultiple,
 * @param customValidators
 */
export function createCheckHandler(
  stores: FormulaStores,
  updateMultiple?: (checked: boolean, value: unknown) => unknown[],
  customValidators?: ValidationRules,
): (event: Event) => void {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLInputElement;
    const details = extractCheckbox(el, updateMultiple, customValidators);
    valueUpdate(details, stores);
  };
}

/**
 * Create a handler for radio elements
 * @param stores
 * @param customValidators
 */
export function createRadioHandler(stores: FormulaStores, customValidators?: ValidationRules): (event: Event) => void {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLInputElement;
    const details = extractRadio(el, customValidators);
    valueUpdate(details, stores);
  };
}

/**
 * Create a handler for select elements
 * @param stores
 * @param customValidators
 */
export function createSelectHandler(stores: FormulaStores, customValidators?: ValidationRules): (event: Event) => void {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLSelectElement;
    const details = extractSelect(el, customValidators);
    valueUpdate(details, stores);
  };
}

/**
 * Create a handler for a file element
 * @param stores
 * @param customValidators
 */
export function createFileHandler(stores: FormulaStores, customValidators?: ValidationRules): (event: Event) => void {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as HTMLInputElement;
    const details = extractFile(el, customValidators);
    valueUpdate(details, stores);
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
