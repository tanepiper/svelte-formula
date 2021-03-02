import { FormEl, FormulaStores } from '../../types';

/**
 * Check if two arrays match
 * @param array1
 * @param array2
 */
function matchingArrays(array1: unknown[], array2: unknown[]) {
  return array1.every((e) => array2.includes(e));
}

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
export function createDirtyHandler<T extends Record<string, unknown | unknown[]>>(
  name: string,
  elements: FormEl[],
  stores: FormulaStores<T>,
): () => void {
  /**
   * Internal map of element blur handlers
   */
  const elementHandlers = new Map<FormEl, (e: Event) => void>();

  /**
   * Internal map of initial values
   */
  const initialValues = new Map<string, unknown | unknown[]>();

  const destroy = () => {
    for (const [el, handler] of elementHandlers) {
      el.setAttribute('data-formula-dirty', 'true');
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
          if (!matchingArrays(v[groupName] as unknown[], startValue as unknown[])) {
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

  for (const el of elements) {
    const handler = createElementHandler(name);
    el.addEventListener('blur', handler);
    elementHandlers.set(el, handler);
  }

  return destroy;
}
