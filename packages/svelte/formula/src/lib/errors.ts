import { FormEl, FormulaError } from '../types/forms';
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
): string {
  let { messages } = options;
  const customMessages = (messages && messages[name]) || {};

  let message = '';
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
 * Create a validation checker for an element group - when an element has been updated.  If there are no options
 * just return the element validity. If there are options, check with custom validators if thet exist,
 * and also check for custom messages
 *
 * @private
 *
 * @param name The group name for the validator
 * @param options The passed formula options
 *
 * @returns Function that is called each time an element is updated which returns field validity state
 */
export function createValidationChecker(name: string, options?: FormulaOptions) {
  /**
   * Method called each time a field is updated
   *
   * @private
   *
   * @param el The element to check
   * @param value The group value from the store
   *
   * @returns A Formula Error object
   */
  return (el: FormEl, groupValue: unknown | unknown[]): FormulaError => {
    el.setCustomValidity('');
    if (!options) {
      const valid = el.checkValidity();
      return {
        valid,
        invalid: !valid,
        message: el.validationMessage,
        errors: extractErrors(el),
      };
    }
    const { validators } = options;
    const customErrors: Record<string, boolean> = {};

    // Handle custom validation
    if ((groupValue !== '' || groupValue !== null) && validators && validators[name]) {
      const customValidators = Object.entries(validators[name]);
      for (let i = 0; i < customValidators.length; i++) {
        const [name, validator] = customValidators[i];
        const message = validator(groupValue);
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

    const valid = el.checkValidity();
    return {
      valid,
      invalid: !valid,
      message: message || el.validationMessage,
      errors,
    };
  };
}
