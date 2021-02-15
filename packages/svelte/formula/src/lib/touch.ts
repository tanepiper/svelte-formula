import { FormEl } from '../types/forms';
import { Writable } from 'svelte/store';

/**
 * Create a handler for an element for when it's focused, when it is called update the
 * touched store and unsubscribe immediately
 * @param el
 * @param touched
 */
export function createTouchHandler(el: FormEl, touched: Writable<Record<string, boolean>>) {
  /**
   * Handle the update to the touched store then unsubscribe
   * @private
   * @param event
   */
  function updateTouched(event: MouseEvent) {
    const name = el.getAttribute('name');
    touched.update((state) => ({ ...state, [name]: true }));
    el.removeEventListener('focus', updateTouched);
  }

  el.addEventListener('focus', updateTouched);
}
