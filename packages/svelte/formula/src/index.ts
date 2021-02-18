import { createForm } from './lib/form';
import { FormulaError, FormValues } from './types/forms';
import { FormulaOptions } from './types/options';
import { Formula, FormulaStores } from './types/formula';
import { createStores } from './lib/init';

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
  const stores = createStores();

  const { create, update, destroy } = createForm(
    {
      ...stores,
      options,
    },
    formulaStores,
  );

  return {
    form: create,
    updateForm: update,
    destroyForm: destroy,
    ...stores,
  };
}
