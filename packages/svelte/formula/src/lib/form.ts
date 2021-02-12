import { FormEl } from '../types/forms';
import { Writable } from 'svelte/store';

function extractErrors(el: FormEl) {
  const output: any = {};
  for (let key in el.validity) {
    if (key !== 'valid') {
      if ((el.validity as any)[key]) {
        output[key] = (el.validity as any)[key];
      }
    }
  }
  return output;
}


function handleFormUpdates(nodeList: NodeListOf<HTMLElement>, values, isValid) {
  return () => {
    const fields = Array.from(nodeList).map((el: FormEl) => ({
      name: el.getAttribute('name') as string,
      value: el.value,
      valid: el.checkValidity(),
      invalid: !el.checkValidity(),
      message: el.validationMessage,
      errors: extractErrors(el)
    }));

    isValid.set(fields.every(v => v.valid));
    values.set(fields.reduce((a, b) => ({ ...a, [b.name]: b }), {}));
  };
}

/**
 * Attach this to any element
 * @param values
 * @param isValid
 */
export function createForm(values: Writable<unknown>, isValid:  Writable<boolean>) {

  return function form(node: HTMLElement) {
    const nodeList = node.querySelectorAll('*[name]') as NodeListOf<FormEl>;
    const handler = handleFormUpdates(nodeList, values, isValid);

    node.addEventListener('keyup', handler);
    node.addEventListener('change', handler);

    handler();

    return {
      destroy: () => {
        node.removeEventListener('keyup', handler);
        node.removeEventListener('change', handler);
      }
    };
  };
}
