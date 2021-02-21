import { createForm } from './lib/form/form';
import { createGroup } from './lib/group/group';
import { Beaker, BeakerStores, Formula, FormulaError, FormulaOptions, FormulaStores, FormValues } from './types';
import { createFormStores, createGroupStores } from './lib/shared/stores';

export { Beaker, BeakerStores, Formula, FormulaError, FormulaOptions, FormulaStores, FormValues };

/**
 * A global map of stores for elements with an `id` property and the `use` directive,
 * if no ID is used the store is not added
 * @type Map<string, FormulaStores>
 */
export const formulaStores = new Map<string, FormulaStores<FormValues>>();
export const beakerStores = new Map<string, BeakerStores<FormValues>>();

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
export function formula<T extends FormValues>(options?: FormulaOptions): Formula<T> {
  const stores = createFormStores<T>(options);

  const { create, update, destroy, reset } = createForm(stores, options, formulaStores);

  return {
    form: create,
    updateForm: update,
    destroyForm: destroy,
    resetForm: reset,
    stores,
    ...stores,
  };
}

/**
 * The beaker function returns an instance of a group of elements and their stores, it also provides methods
 * to set the group value store
 *
 * @param options
 *
 * @returns Beaker object containing the form group and it's associated methods
 */
export function beaker<T extends FormValues>(options?: FormulaOptions): Beaker<T> {
  const stores = createGroupStores<T>(options);
  const { create, destroy, reset, forms } = createGroup<T>(stores, options, beakerStores as any);
  return {
    group: create,
    destroy: destroy,
    forms,
    reset,
    stores,
    ...stores,
    init: (items) => stores.formValues.set(items),
    add: (item) => stores.formValues.update((state) => [...state, item]),
    delete: (index) =>
      stores.formValues.update((state) => {
        state.splice(index, 1);
        return state;
      }),
    clear: () => stores.formValues.set([]),
  };
}
