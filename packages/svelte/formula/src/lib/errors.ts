import { FormEl } from 'packages/svelte/formula/src/types/forms';

export function extractErrors(el: FormEl) {
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
