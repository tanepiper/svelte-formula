const multiCheckbox = new Map<string, Set<unknown>>();

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
