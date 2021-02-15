import { FormEl } from '../types/forms';

/**
 * Extract all fields with a `name` attribute, then only return the ones that have `checkValidity` as we use these
 * for our validity state
 *
 * @private
 * @internal
 * @param rootEl
 */
export function getAllFieldsWithValidity(rootEl: HTMLElement) {
  const nodeList = rootEl.querySelectorAll('*[name]') as NodeListOf<HTMLElement>;
  return Array.from(nodeList).filter((el) => (el as any).checkValidity) as FormEl[];
}

/**
 * Check if our checkbox has multiple values of the same name
 * @param name
 * @param elements
 */
export function isMultiCheckbox(name: string, elements: FormEl[]): boolean {
  return elements.filter((el) => el.type === 'checkbox' && el.name === name).length > 1;
}

/**
 * Check if our checkbox has multiple values of the same name
 * @param name
 * @param elements
 */
export function hasMultipleNames(name: string, elements: FormEl[]): boolean {
  return elements.filter((el) => el.name === name).length > 1;
}
