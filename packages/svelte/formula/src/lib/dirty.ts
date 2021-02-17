import { FormEl } from '../types/forms';
import { FormulaStores } from '../types/formula';

/**
 * Creates the handler for a group of elements for the dirty event on the group name, once an
 * element in the group has been changed, all element blur handlers will be removed
 *
 * @private
 *
 * @param name The name of the group to create the blur handlers for
 * @param elements The elements that belong to the named group
 * @param stores The stores for the form instance
 *
 * @returns Function that when called will remove all blur handlers from the elements, if not removed by user action
 */
export function createDirtyHandler(name: string, elements: FormEl[], stores: FormulaStores): () => void {
  /**
   * Internal map of element blur handlers
   */
  const elementHandlers = new Map<FormEl, (e: Event) => void>();

  /**
   * Internal map of initial values
   */
  const initialValues = new Map<string, unknown | unknown[]>();

  const destroy = () => {
    for (let [el, handler] of elementHandlers) {
      el.removeEventListener('blur', handler);
    }
    elementHandlers.clear();
  };

  // Set initial dirty state and initial value
  stores.dirty.update((state) => ({ ...state, [name]: false }));
  stores.formValues.subscribe((v) => initialValues.set(name, v[name]))();

  function createElementHandler(groupName: string) {
    return () => {
      const startValue = initialValues.get(groupName);

      // Take the current form values and check if the user has changed it
      stores.formValues.subscribe((v) => {
        if (Array.isArray(v[groupName])) {
          const newVal = new Set(v[groupName] as unknown[]);
          const existing = new Set(startValue as unknown[]);
          const same = [...newVal].every((e) => [...existing].includes(e));
          if (!same) {
            stores.dirty.update((state) => ({ ...state, [groupName]: true }));
            destroy();
          }
        } else if (v[groupName] !== startValue) {
          stores.dirty.update((state) => ({ ...state, [groupName]: true }));
          destroy();
        }
      })();
    };
  }

  for (let el of elements) {
    const handler = createElementHandler(name);
    el.addEventListener('blur', handler);
    elementHandlers.set(el, handler);
  }

  return destroy;
}
