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
 */
export function formula(options?: FormulaOptions): Formula {
  const stores = createStores();

  return {
    form: createForm({
      ...stores,
      options,
    }),
    ...stores,
  };
}
