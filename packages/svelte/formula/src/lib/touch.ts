import { FormEl } from '../types/forms';
import { FormulaStores } from '../types/formula';

/**
 * Create a handler for adding and removing focus events on elements
 * @param name
 * @param elements
 * @param stores
 */
export function createTouchHandlers(name: string, elements: FormEl[], stores: FormulaStores) {
  const elMap = new Map<FormEl, (event: Event) => void>();
  stores.touched.update((state) => ({ ...state, [name]: false }));

  function updateTouched() {
    return () => {
      stores.touched.update((state) => ({ ...state, [name]: true }));
      [...elMap].forEach(([el, handler]) => el.removeEventListener('focus', handler));
    };
  }

  elements.forEach((el) => {
    const handler = updateTouched();
    el.addEventListener('focus', handler);
    elMap.set(el, handler);
  });

  return () => [...elMap].forEach(([el, handler]) => el.removeEventListener('focus', handler));
}
