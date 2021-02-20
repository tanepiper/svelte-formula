import { FormEl } from '../../types';

/**
 * Extract all fields with a `name` attribute, then only return the ones that have `checkValidity` as we use these
 * for our validity state
 *
 * @private
 * @internal
 * @param rootEl
 * @param isGroup
 */
export function getAllFieldsWithValidity(rootEl: HTMLElement, isGroup?: boolean): FormEl[] {
  let select = isGroup ? '[role="group"] *[name]' : '*[name]:not([role="group"] *[name])';

  const nodeList = rootEl.querySelectorAll(select) as NodeListOf<HTMLElement>;
  return Array.from(nodeList).filter((el: FormEl) => el.checkValidity) as FormEl[];
}
