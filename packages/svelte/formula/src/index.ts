import { createForm } from './lib/form/form';
import { createGroup } from './lib/group/group';
import { Beaker, BeakerOptions, BeakerStores, Formula, FormulaError, FormulaOptions, FormulaStores } from './types';

export { Beaker, BeakerStores, Formula, FormulaError, FormulaOptions, FormulaStores };

/**
 * A global map of stores for elements with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type Map<string, FormulaStores>
 */
export const formulaStores = new Map<string, FormulaStores<Record<string, unknown | unknown[]>>>() as any;
export const beakerStores = new Map<string, BeakerStores<Record<string, unknown | unknown[]>>>() as any;

/**
 * The `formula` function returns a form object that can be bound to any HTML
 * element that contains form inputs.  Once bound you can get the current values
 *
 * @param options Optional options that the library supports, none of these options are
 * required to use Formula
 *
 * @returns Formula object containing the current form, function to update or destroy
 * the form and all the stores available for the form
 */
export function formula<T extends Record<string, unknown | unknown[]>>(options?: FormulaOptions): Formula<T> {
  return createForm<T>(options, formulaStores);
}

/**
 * The beaker function returns an instance of a group of elements and their stores, it also provides methods
 * to set the group value store
 *
 * @param options
 *
 * @returns Beaker object containing the form group and it's associated methods
 */
export function beaker<T extends Record<string, unknown | unknown[]>>(options?: BeakerOptions): Beaker<T> {
  return createGroup<T>(options, beakerStores);
}
