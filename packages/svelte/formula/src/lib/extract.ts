import { FormEl } from 'packages/svelte/formula/src/types/forms';
import { extractErrors } from 'packages/svelte/formula/src/lib/errors';

export function extractData(el: FormEl) {
  return {
    name: el.getAttribute('name') as string,
    value: el.value,
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  };
}

export function extractCheckbox(el: HTMLInputElement) {
  return {
    name: el.getAttribute('name') as string,
    value: el.checked,
    valid: el.checkValidity(),
    message: el.validationMessage,
    errors: extractErrors(el),
  };
}
