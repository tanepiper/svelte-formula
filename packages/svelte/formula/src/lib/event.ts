import { ExtractedFormInfo, FormEl, FormulaError } from '../types/forms';
import { extractCheckbox, extractData, extractFile, extractRadio, extractSelect } from './extract';
import { ValidationFn, ValidationRules } from '../types/validation';
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
 * Create an event handler for the passed event and handle the value type
 * @param name
 * @param groupElements
 * @param stores
 * @param customValidators
 */
function createEventHandler(
  name: string,
  groupElements: FormEl[],
  stores: FormulaStores,
  customValidators?: Record<string, ValidationFn>,
) {
  return (event: KeyboardEvent | MouseEvent) => {
    const el = (event.currentTarget || event.target) as FormEl;

    if (el instanceof HTMLSelectElement) {
      valueUpdate(extractSelect(name, el as HTMLSelectElement, customValidators), stores);
    } else {
      switch (el.type) {
        case 'checkbox': {
          valueUpdate(
            extractCheckbox(name, el as HTMLInputElement, groupElements as HTMLInputElement[], customValidators),
            stores,
          );
          break;
        }
        case 'file': {
          valueUpdate(extractFile(name, el as HTMLInputElement, customValidators), stores);
          break;
        }
        case 'radio': {
          valueUpdate(extractRadio(name, el as HTMLInputElement), stores);
          break;
        }
        default: {
          valueUpdate(extractData(name, el, groupElements, customValidators), stores);
        }
      }
    }
  };
}

export function createHandler(
  name: string,
  eventName: string,
  element: FormEl,
  groupElements: FormEl[],
  stores: FormulaStores,
  customValidators?: ValidationRules,
): () => void {
  const handler = createEventHandler(name, groupElements, stores, customValidators);
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
