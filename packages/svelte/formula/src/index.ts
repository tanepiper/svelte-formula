import { createForm } from './lib/form';
import { FormulaError, FormValues } from './types/forms';
import { FormulaOptions } from './types/options';
import { Formula } from './types/formula';
import { createStores } from './lib/init';

export { FormulaError, FormValues };

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
  const stores = createStores();

  const { create, update, destroy } = createForm({
    ...stores,
    options,
  });

  return {
    form: create,
    updateForm: update,
    destroyForm: destroy,
    ...stores,
  };
}
