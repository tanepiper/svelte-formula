import { FormEl, FormErrors, FormValues } from '../types/forms';
import { Writable } from 'svelte/store';
import { getAllFieldsWithValidity, hasMultipleNames, isMultiCheckbox } from './fields';
import {
  createCheckHandler,
  createFileHandler,
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
import { checkFormValidity } from 'packages/svelte/formula/src/lib/errors';

export function createForm({
  formValues,
  submitValues,
  formValidity,
  validity,
  isFormValid,
  touched,
  dirty,
  options,
}: {
  formValues: Writable<FormValues>;
  submitValues: Writable<FormValues>;
  formValidity: Writable<Record<string, string>>;
  validity: Writable<FormErrors>;
  isFormValid: Writable<boolean>;
  touched: Writable<Record<string, boolean>>;
  dirty: Writable<Record<string, boolean>>;
  options?: FormulaOptions;
}) {
  return function form(node: HTMLElement) {
    const keyupHandlers = new Map<HTMLElement, any>();
    const changeHandlers = new Map<HTMLElement, any>();

    let submitHandler = undefined;

    const formElements = getAllFieldsWithValidity(node);

    formElements.forEach((el: FormEl) => {
      // Create a single touch handler for each element, this is removed after it has first been focused
      createTouchHandler(el, touched);
      createInitialValues(el, formElements, formValues, validity, touched);
      createDirtyHandler(el, dirty, formValues);

      const name = el.getAttribute('name') as string;

      const customValidations = options?.validators?.[name];

      if (el instanceof HTMLSelectElement) {
        const handler = createSelectHandler(formValues, validity, isFormValid, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else if (el.type === 'radio') {
        const handler = createRadioHandler(formValues, validity, isFormValid, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else if (el.type === 'checkbox') {
        const isMultiple = isMultiCheckbox(name, formElements);
        let updateMultiple;
        if (isMultiple) {
          updateMultiple = checkboxMultiUpdate(name);
        }
        const handler = createCheckHandler(formValues, validity, isFormValid, updateMultiple, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else if (el.type === 'file') {
        const handler = createFileHandler(formValues, validity, isFormValid, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else {
        const isMultiple = hasMultipleNames(name, formElements);
        let updateMultiple;
        if (isMultiple) {
          updateMultiple = inputMultiUpdate(name, options?.locale);
        }
        const handler = createValueHandler(formValues, validity, isFormValid, updateMultiple, customValidations);
        if (['range', 'color', 'date', 'time', 'week'].includes(el.type)) {
          el.addEventListener('change', handler);
          changeHandlers.set(el, handler);
        } else {
          el.addEventListener('keyup', handler);
          keyupHandlers.set(el, handler);
        }
      }
    });

    let unsub = () => {};
    if (options?.formValidators) {
      unsub = checkFormValidity(formValues, formValidity, isFormValid, options.formValidators);
    }

    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(formValues, submitValues);
      node.addEventListener('submit', submitHandler);
    }

    return {
      destroy: () => {
        unsub();
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
