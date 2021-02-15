import { FormEl } from '../types/forms';
import { Writable } from 'svelte/store';

const hasTouched = new Set<string>();

/**
 * Create a handler for an element for when it's focused, when it is called update the
 * touched store and unsubscribe immediately
 * @param el
 * @param touched
 */
export function createTouchHandler(el: FormEl, touched: Writable<Record<string, boolean>>) {
  const name = el.getAttribute('name');

  /**
   * Handle the update to the touched store then unsubscribe
   * @private
   * @param event
   */
  function updateTouched(event: MouseEvent) {
    touched.update((state) => ({ ...state, [name]: true }));
    el.removeEventListener('focus', updateTouched);
  }

  if (!hasTouched.has(name)) {
    el.addEventListener('focus', updateTouched);
    hasTouched.add(name);
  }
}
