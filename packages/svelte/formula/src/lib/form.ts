import { FormEl, FormErrors, FormValues } from '../types/forms';
import { Writable } from 'svelte/store';
import { getAllFieldsWithValidity, hasMultipleNames, isMultiCheckbox } from './fields';
import {
  createCheckHandler,
  createRadioHandler,
  createSelectHandler,
  createSubmitHandler,
  createValueHandler,
} from './event';
import { createInitialValues } from './init';
import { createTouchHandler } from './touch';
import { checkboxMultiUpdate, inputMultiUpdate } from './multi-value';
import { createDirtyHandler } from './dirty';
import { FormulaOptions } from '../types/options';

export function createForm(
  values: Writable<FormValues>,
  submit: Writable<FormValues>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
  touched: Writable<Record<string, boolean>>,
  dirty: Writable<Record<string, boolean>>,
  options?: FormulaOptions,
) {
  return function form(node: HTMLElement) {
    const keyupHandlers = new Map<HTMLElement, any>();
    const changeHandlers = new Map<HTMLElement, any>();

    let submitHandler = undefined;

    const formElements = getAllFieldsWithValidity(node);

    formElements.forEach((el: FormEl) => {
      // Create a single touch handler for each element, this is removed after it has first been focused
      createTouchHandler(el, touched);
      createInitialValues(el, formElements, values, errors, touched);
      createDirtyHandler(el, dirty, values);

      const name = el.getAttribute('name') as string;

      const customValidations = options?.validators?.[name];

      if (el instanceof HTMLSelectElement) {
        const handler = createSelectHandler(values, errors, isValid, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else if (el.type === 'radio') {
        const handler = createRadioHandler(values, errors, isValid, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else if (el.type === 'checkbox') {
        const isMultiple = isMultiCheckbox(name, formElements);
        let updateMultiple;
        if (isMultiple) {
          updateMultiple = checkboxMultiUpdate(name);
        }
        const handler = createCheckHandler(values, errors, isValid, updateMultiple, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else {
        const isMultiple = hasMultipleNames(name, formElements);
        let updateMultiple;
        if (isMultiple) {
          updateMultiple = inputMultiUpdate(name, options?.locale);
        }
        const handler = createValueHandler(values, errors, isValid, updateMultiple, customValidations);
        el.addEventListener('keyup', handler);
        keyupHandlers.set(el, handler);
      }
    });

    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(values, submit);
      node.addEventListener('submit', submitHandler);
    }

    return {
      destroy: () => {
        [...keyupHandlers].forEach(([el, fn]) => {
          el.removeEventListener('keyup', fn);
        });
        [...changeHandlers].forEach(([el, fn]) => {
          el.removeEventListener('change', fn);
        });
        if (submitHandler) {
          node.removeEventListener('submit', submitHandler);
        }
      },
    };
  };
}
