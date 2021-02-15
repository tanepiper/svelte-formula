import { FormEl } from '../types/forms';

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
