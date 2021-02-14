import { FormEl, FormErrors, FormValues } from '../types/forms';
import { Writable } from 'svelte/store';
import { getAllFieldsWithValidity } from './dom';
import {
  createCheckHandler,
  createRadioHandler,
  createSelectHandler,
  createSubmitHandler,
  createTouchHandler,
  createValueHandler,
} from './event';
import { initCheckboxValue, initFormValue, initRadioValue } from './init';

export function createForm(
  values: Writable<FormValues>,
  submit: Writable<FormValues>,
  errors: Writable<FormErrors>,
  isValid: Writable<boolean>,
  touched: Writable<Record<string, boolean>>,
) {
  return function form(node: HTMLElement) {
    const keyupHandlers = new Map<HTMLElement, any>();
    const radioHandlers = new Map<HTMLElement, any>();
    const checkboxHandlers = new Map<HTMLElement, any>();
    let submitHander = undefined;

    const formElements = getAllFieldsWithValidity(node);

    formElements.forEach((el: FormEl) => {
      console.dir(el);
      // Initialise the form data
      createTouchHandler(el, touched);

      if (el instanceof HTMLSelectElement) {
        initFormValue(el, values, errors, touched);
        const handler = createSelectHandler(values, errors, isValid);
        el.addEventListener('change', handler);
        keyupHandlers.set(el, handler);
      } else if (el.type === 'radio') {
        initRadioValue(el as HTMLInputElement, values, errors, touched);
        const handler = createRadioHandler(values, errors, isValid);
        el.addEventListener('change', handler);
        radioHandlers.set(el, handler);
      } else if (el.type === 'checkbox') {
        initCheckboxValue(el as HTMLInputElement, values, errors, touched);
        const handler = createCheckHandler(values, errors, isValid);
        el.addEventListener('change', handler);
        checkboxHandlers.set(el, handler);
      } else {
        initFormValue(el, values, errors, touched);
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
        [...radioHandlers, ...checkboxHandlers].forEach(([el, fn]) => {
          el.removeEventListener('change', fn);
        });
        if (submitHander) {
          node.removeEventListener('submit', submitHander);
        }
      },
    };
  };
}
