/**
 * @private
 * @param elements
 */
// function getElementsProperties(elements: FormEl[]) {
//   return elements.map((el: FormEl) => ({
//     name: el.getAttribute('name') as string,
//     value: el.value,
//     valid: el.checkValidity(),
//     message: el.validationMessage,
//     errors: extractErrors(el),
//   }));
// }

/**
 *
 * @param withValues
 * @param values
 * @param errors
 * @param isValid
 */
// function handleFormUpdates(
//   withValues: FormEl[],
//   values: Writable<FormValues>,
//   errors: Writable<FormErrors>,
//   isValid: Writable<boolean>,
// ) {
//   return (event: Event) => {
//     const fields = getElementsProperties(withValues);
//
//     isValid.set(fields.every((v) => v.valid));
//     values.set(fields.reduce((a, b) => ({ ...a, [b.name]: b.value }), {}));
//     errors.set(
//       fields.reduce(
//         (a, b) => ({
//           ...a,
//           [b.name]: {
//             valid: b.valid,
//             message: b.message,
//             invalid: !b.valid,
//             errors: b.errors,
//           },
//         }),
//         {},
//       ),
//     );
//   };
// }

// function handleTouched(elements: FormEl[], touched: Writable<Record<string, boolean>>) {
//   function updateTouched(event: MouseEvent) {
//     const el = (event.currentTarget || event.target) as HTMLElement;
//     const name = el.getAttribute('name');
//     touched.update((state) => ({ ...state, [name]: true }));
//
//     el.removeEventListener('focus', updateTouched);
//   }
//
//   elements.forEach((el) => el.addEventListener('focus', updateTouched));
// }
