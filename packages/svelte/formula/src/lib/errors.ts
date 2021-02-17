import { FormEl } from '../types/forms';
import { ValidationRule } from '../types/validation';
import { FormulaStores } from '../types/formula';
import { FormulaOptions } from '../types/options';

/**
 * Extract the errors from the element validity - as it's not enumerable, it cannot be
 * destructured and we need to loop over the keys manually
 * @param el
 * @param custom
 */
function extractErrors(el: FormEl, custom?: Record<string, boolean>): Record<string, boolean> {
  const output: any = {};
  for (let key in el.validity) {
    if (key !== 'valid') {
      // Skip the `valid` key so we only return errors
      if ((el.validity as any)[key]) {
        output[key] = (el.validity as any)[key];
      }
    }
  }
  return { ...output, ...custom };
}

/**
 * Check for custom messages contained in data attributes, or within the passed options
 * @param name
 * @param errors
 * @param el
 * @param options
 */
function checkForCustomMessage(
  name: string,
  errors: Record<string, boolean>,
  el: FormEl,
  options?: FormulaOptions,
): string | undefined {
  let { messages } = options;
  const customMessages = (messages && messages[name]) || {};

  let message;
  const dataSet = el.dataset;
  Object.keys(dataSet).forEach((key) => {
    if (errors[key]) {
      message = dataSet[key];
    }
  });
  if (!message) {
    Object.keys(customMessages).forEach((key) => {
      if (errors[key]) {
        message = customMessages[key];
      }
    });
  }
  return message;
}

/**
 * Do form level validations
 * @param stores
 * @param customValidators
 */
export function createFormValidator(stores: FormulaStores, customValidators: ValidationRule) {
  const sub = stores.formValues.subscribe((values) => {
    stores.formValidity.set({});
    const validators = Object.entries(customValidators);
    for (let i = 0; i < validators.length; i++) {
      const [name, validator] = validators[i];
      const invalid = validator(values);
      if (invalid !== null) {
        stores.formValidity.update((state) => ({ ...state, [name]: invalid }));
        stores.isFormValid.set(false);
      }
    }
  });

  return () => sub();
}

/**
 * Check the validity of a field and against custom validators
 * @param name
 * @param options
 */
export function createValidationChecker(name: string, options?: FormulaOptions) {
  /**
   * Method called each time we want to do validity
   */
  return (el: FormEl, value: unknown | unknown[]) => {
    el.setCustomValidity('');
    if (!options) {
      return {
        valid: el.checkValidity(),
        message: el.validationMessage,
        errors: extractErrors(el),
      };
    }
    const { validators } = options;
    const customErrors: Record<string, boolean> = {};

    // Handle custom validation
    if ((value !== '' || value !== null) && validators && validators[name]) {
      const customValidators = Object.entries(validators[name]);
      for (let i = 0; i < customValidators.length; i++) {
        const [name, validator] = customValidators[i];
        const message = validator(value);
        if (message !== null) {
          if (!el.validationMessage) {
            el.setCustomValidity(message);
          }
          customErrors[name] = true;
        }
      }
    }

    // Check for any custom messages
    const errors = extractErrors(el, customErrors);
    let message = checkForCustomMessage(name, errors, el, options);

    return {
      valid: el.checkValidity(),
      message: message || el.validationMessage,
      errors,
    };
  };
}
