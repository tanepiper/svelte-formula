import { FormEl } from '../../types';

/**
 * Extract all fields from the form that are valid inputs with `name` property that are not part of a form group
 *
 * @private
 * @internal
 * @param rootEl
 */
export function getFormFields(rootEl: HTMLElement): FormEl[] {
  const nodeList = rootEl.querySelectorAll('*[name]:not([data-in-group])') as NodeListOf<HTMLElement>;
  return Array.from(nodeList).filter((el: FormEl) => el.checkValidity) as FormEl[];
}

/**
 * Extract all fields from a group that are valid inputs with `name` property
 * @param rootEl
 */
export function getGroupFields(rootEl: HTMLElement): FormEl[] {
  const nodeList = rootEl.querySelectorAll('*[name]') as NodeListOf<HTMLElement>;
  return Array.from(nodeList).filter((el: FormEl) => el.checkValidity) as FormEl[];
}
