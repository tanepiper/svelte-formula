import { Writable } from 'svelte/store';
import { FormEl, FormValues } from '../types/forms';
import { ValidationRules } from '../types/validation';
import { FormulaStores } from 'packages/svelte/formula/src/types/formula';

/**
 * Extract the errors from the element validity - as it's not enumerable, it cannot be
 * destructured and we need to loop over the keys manually
 * @param el
 */
export function extractErrors(el: FormEl): Record<string, boolean> {
  const output: any = {};
  for (let key in el.validity) {
    if (key !== 'valid') {
      // Skip the `valid` key so we only return errors
      if ((el.validity as any)[key]) {
        output[key] = (el.validity as any)[key];
      }
    }
  }
  return output;
}

/**
 * Do form level validations
 * @param stores
 * @param customValidators
 */
export function checkFormValidity(
  stores: FormulaStores,
  customValidators: ValidationRules,
) {
  return stores.formValues.subscribe((values) => {
    stores.formValidity.set({});
    const validators = Object.entries(customValidators);
    for (let i = 0; i < validators.length; i++) {
      const [name, validator] = validators[i];
      const invalid = validator(values);
      if (invalid) {
        stores.formValidity.update((state) => ({ ...state, [name]: invalid }));
        stores.isFormValid.set(false);
      }
    }
  });
}

/**
 * Check the validity of a field and against custom validators
 * @param el
 * @param value
 * @param customValidators
 */
export function checkValidity(el: FormEl, value: unknown | unknown[], customValidators?: ValidationRules) {
  const result = {
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  };
  if (customValidators) {
    const validators = Object.entries(customValidators);

    for (let i = 0; i < validators.length; i++) {
      const [name, validator] = validators[i];
      const message = validator(value);
      if (message === null) {
        continue;
      }
      if (result.valid === true) {
        result.valid = false;
        result.message = message;
        result.errors[name] = true;
      } else {
        result.errors[name] = true;
      }
    }
  }
  return result;
}
