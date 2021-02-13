import { FormEl, FormErrors, FormValues } from '../types/forms';
import { extractErrors } from './errors';
import { Writable } from 'svelte/store';

/**
 * @private
 * @param elements
 */
function getElementsProperties(elements: FormEl[]) {
  return elements.map((el: FormEl) => ({
    name: el.getAttribute('name') as string,
    value: el.value,
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  }));
}

/**
 *
 * @param withValues
 * @param values
 * @param errors
 * @param isValid
 */
function handleFormUpdates(withValues: FormEl[], values: Writable<FormValues>, errors: Writable<FormErrors>, isValid: Writable<boolean>) {
  return () => {
    const fields = getElementsProperties(withValues);

    isValid.set(fields.every((v) => v.valid));
    values.set(fields.reduce((a, b) => ({ ...a, [b.name]: b.value }), {}));
    errors.set(
      fields.reduce(
        (a, b) => ({
          ...a,
          [b.name]: {
            valid: b.valid,
            message: b.message,
            invalid: !b.valid,
            errors: b.errors,
          },
        }),
        {},
      ),
    );
  };
}

export function createForm(values: Writable<FormValues>, submit: Writable<FormValues>, errors: Writable<FormErrors>, isValid: Writable<boolean>) {
  return function form(node: HTMLElement) {
    const nodeList = node.querySelectorAll('*[name]') as NodeListOf<HTMLElement>;
    const withValidity: FormEl[] = Array.from(nodeList).filter((el) => (el as any).checkValidity) as FormEl[];

    const valueHandler = handleFormUpdates(withValidity, values, errors, isValid);
    const submitHander = handleFormUpdates(withValidity, submit, errors, isValid);

    if (node instanceof HTMLFormElement) {
      node.addEventListener('submit', submitHander);
    }
    node.addEventListener('keyup', valueHandler);
    node.addEventListener('blur', valueHandler);

    valueHandler();

    return {
      destroy: () => {
        if (node instanceof HTMLFormElement) {
          node.removeEventListener('submit', submitHander);
        }
        node.removeEventListener('keyup', valueHandler);
        node.removeEventListener('blur', valueHandler);
      },
    };
  };
}
