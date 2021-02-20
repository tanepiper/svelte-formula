/**
 * Generates an array of values for a group containing an object for each row
 * @param formValues
 */
export function generateGroupArray(formValues) {
  const keys = Object.keys(formValues);
  if (keys.length === 0) {
    return [];
  }
  if ((formValues[keys[0]] as unknown[]).length === 0) {
    return [];
  }

  const final = [];
  for (let i = 0; i < (formValues[keys[0]] as unknown[]).length; i++) {
    final.push(keys.reduce((val, key) => ({ ...val, [key]: formValues[key][i] }), {}));
  }
  return final;
}
