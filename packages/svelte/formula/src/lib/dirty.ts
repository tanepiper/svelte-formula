import { FormEl } from '../types/forms';
import { FormulaStores } from '../types/formula';

/**
 * Create a set of dirty handlers for the current element group, set the value to false and store
 * the initial value, listen for change events and when the dirty check is true, unsubscribe all
 * event handlers
 * @param name
 * @param elements
 * @param stores
 */
export function createDirtyHandler(name: string, elements: FormEl[], stores: FormulaStores) {
  const handlers = new Map<FormEl, (e: Event) => void>();
  const initialValue = new Map<string, unknown | unknown[]>();

  stores.dirty.update((state) => ({ ...state, [name]: false }));
  stores.formValues.subscribe((v) => initialValue.set(name, v[name]))();

  function updateDirty(groupName: string) {
    return () => {
      const startValue = initialValue.get(groupName);
      stores.formValues.subscribe((v) => {
        if (Array.isArray(v[groupName])) {
          const newVal = new Set(v[groupName] as unknown[]);
          const existing = new Set(startValue as unknown[]);
          const same = [...newVal].every((e) => [...existing].includes(e));
          if (!same) {
            stores.dirty.update((state) => ({ ...state, [groupName]: true }));
            [...handlers].forEach(([el, handler]) => el.removeEventListener('blur', handler));
          }
        } else if (v[groupName] !== startValue) {
          stores.dirty.update((state) => ({ ...state, [groupName]: true }));
        }
      })();
    };
  }

  elements.forEach((el) => {
    const handler = updateDirty(name);
    el.addEventListener('blur', handler);
    handlers.set(el, handler);
  });

  return () => {
    [...handlers].forEach(([el, handler]) => el.removeEventListener('blur', handler));
  };
}
