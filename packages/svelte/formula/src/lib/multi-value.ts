const multiCheckbox = new Map<string, Set<unknown>>();
const multiInput = new Map<string, Map<string, unknown>>();

/**
 * Function for handling updates to multiple checkbox support
 * @private
 * @param name
 */
export function checkboxMultiUpdate(name: string): (checked: boolean, value: unknown) => unknown[] {
  if (!multiCheckbox.has(name)) {
    multiCheckbox.set(name, new Set());
  }

  /**
   * Update the set store with the values for the multi checkbox
   * @private
   * @internal
   */
  return (checked: boolean, value: unknown) => {
    const set = multiCheckbox.get(name);
    checked ? set.add(value) : set.delete(value);
    return [...set];
  };
}

/**
 * Support fields that have the same name value that are not checkboxes, these fields
 * require a `id` property
 * @param name
 * @param locale
 */
export function inputMultiUpdate(name: string, locale?: string): (id: string, value: unknown) => unknown[] {
  if (!multiInput.has(name)) {
    multiInput.set(name, new Map());
  }
  if (!locale && typeof navigator.language !== 'undefined') {
    const lang = navigator.language.split('-');
    locale = lang[0] || 'en'; // Always fall back to English for this;
  }
  return (id: string, value: unknown) => {
    const map = multiInput.get(name);
    map.set(id, value);
    return [...map]
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, locale, { numeric: true }))
      .map(([_, val]) => val);
  };
}
