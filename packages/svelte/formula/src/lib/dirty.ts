import { FormEl, FormValues } from '../types/forms';
import { Writable } from 'svelte/store';

const hasDirty = new Map<string, unknown>();

/**
 * Create a handler for an element for when it's focused, when it is called update the
 * touched store and unsubscribe immediately
 * @param el
 * @param dirty
 * @param values
 */
export function createDirtyHandler(el: FormEl, dirty: Writable<Record<string, boolean>>, values: Writable<FormValues>) {
  const name = el.getAttribute('name');

  /**
   * Handle the update to the touched store then unsubscribe
   * @private
   * @param event
   */
  function updateDirty(event: MouseEvent) {
    const startValue = hasDirty.get(name);
    values.subscribe((v) => {
      if (Array.isArray(v[name]) && (v[name] as unknown[]).length !== (startValue as unknown[]).length) {
        dirty.update((state) => ({ ...state, [name]: true }));
        el.removeEventListener('blur', updateDirty);
      } else if (v[name] !== startValue) {
        dirty.update((state) => ({ ...state, [name]: true }));
        el.removeEventListener('blur', updateDirty);
      }
    })();
  }

  if (!hasDirty.has(name)) {
    values.subscribe((v) => hasDirty.set(name, v[name]))();
    dirty.update((state) => ({ ...state, [name]: false }));
    el.addEventListener('blur', updateDirty);
  }
}
