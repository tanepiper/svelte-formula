import { FormEl, FormErrors, FormValues } from '../types/forms';
import { Writable } from 'svelte/store';
import { getAllFieldsWithValidity, isMultiCheckbox } from './dom';
import {
  createCheckHandler,
  createRadioHandler,
  createSelectHandler,
  createSubmitHandler,
  createValueHandler,
} from './event';
import { createInitialValues } from './init';
import { createTouchHandler } from './touch';
import { checkboxMultiUpdate } from 'packages/svelte/formula/src/lib/checkbox';

export function createForm(
  values: Writable<FormValues>,
  submit: Writable<FormValues>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
  touched: Writable<Record<string, boolean>>,
) {
  return function form(node: HTMLElement) {
    const keyupHandlers = new Map<HTMLElement, any>();
    const changeHandlers = new Map<HTMLElement, any>();

    let submitHander = undefined;

    const formElements = getAllFieldsWithValidity(node);

    formElements.forEach((el: FormEl) => {
      // Create a single touch handler for each element, this is removed after it has first been focused
      createTouchHandler(el, touched);
      createInitialValues(el, formElements, values, errors, touched);

      if (el instanceof HTMLSelectElement) {
        const handler = createSelectHandler(values, errors, isValid);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else if (el.type === 'radio') {
        const handler = createRadioHandler(values, errors, isValid);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else if (el.type === 'checkbox') {
        const name = el.getAttribute('name') as string;
        const isMultiple = isMultiCheckbox(name, formElements);
        let updateMultiple;
        if (isMultiple) {
          updateMultiple = checkboxMultiUpdate(name);
        }
        const handler = createCheckHandler(values, errors, isValid, updateMultiple);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else {
        const handler = createValueHandler(values, errors, isValid);
        el.addEventListener('keyup', handler);
        keyupHandlers.set(el, handler);
      }
    });

    if (node instanceof HTMLFormElement) {
      const submitHandler = createSubmitHandler(values, submit);
      node.addEventListener('submit', submitHandler);
      submitHander = submitHandler;
    }

    return {
      destroy: () => {
        [...keyupHandlers].forEach(([el, fn]) => {
          el.removeEventListener('keyup', fn);
        });
        [...changeHandlers].forEach(([el, fn]) => {
          el.removeEventListener('change', fn);
        });
        if (submitHander) {
          node.removeEventListener('submit', submitHander);
        }
      },
    };
  };
}
