import { createForm } from 'packages/svelte/formula/src/lib/form/form';
import { Formula, FormulaError, FormulaOptions, FormulaStores, FormValues } from './types';
import { createFormStores } from 'packages/svelte/formula/src/lib/shared/stores';
import { derived } from 'svelte/store';
import { generateGroupArray } from 'packages/svelte/formula/src/lib/group/data';

export { FormulaError, FormValues, FormulaStores };

/**
 * A global map of stores for elements with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type Map<string, FormulaStores>
 */
export const formulaStores = new Map<string, FormulaStores>();

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
export function formula(options?: FormulaOptions): Formula {
  // Create a store object for this instance, if there is an `id` on the element the stores will be added to formulaStores
  const stores = createFormStores(options);

  const { create, update, destroy, reset } = createForm(stores, options, formulaStores);

  return {
    form: create,
    updateForm: update,
    destroyForm: destroy,
    resetForm: reset,
    ...stores,
  };
}

/**
 * The `beaker` function returns an object that allows for the creation of form groups within your main form
 * The methos returns a group
 * @param options
 */
export function beaker(options?: FormulaOptions): any {
  const stores = createFormStores(options);
  const { create, update, destroy, reset } = createForm(stores, options, formulaStores, true);
  return {
    group: create,
    update: update,
    destroy: destroy,
    reset: reset,
    stores,
    data: derived(stores.formValues, generateGroupArray),
  };
}
