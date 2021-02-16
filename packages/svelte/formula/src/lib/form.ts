import { FormEl } from '../types/forms';
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
import { checkFormValidity } from './errors';
import { FormulaStores } from '../types/formula';

/**
 * Creates the form action
 * @param options
 * @param stores
 */
export function createForm({ options, ...stores }: FormulaStores & { options?: FormulaOptions }) {
  return function form(node: HTMLElement) {
    /**
     * Store for all keyup handlers than need removed when destroyed
     */
    const keyupHandlers = new Map<HTMLElement, (event: Event) => void>();
    const changeHandlers = new Map<HTMLElement, (event: Event) => void>();

    let submitHandler = undefined;

    const formElements = getAllFieldsWithValidity(node);

    formElements.forEach((el: FormEl) => {
      // Create a single touch handler for each element, this is removed after it has first been focused
      createTouchHandler(el, stores.touched);
      createInitialValues(el, formElements, stores.formValues, stores.validity, stores.touched);
      createDirtyHandler(el, stores.dirty, stores.formValues);

      const name = el.getAttribute('name') as string;
      const customValidations = options?.validators?.[name];

      if (el instanceof HTMLSelectElement) {
        const handler = createSelectHandler(stores, customValidations);
        el.addEventListener('change', handler);
        changeHandlers.set(el, handler);
      } else {
        switch (el.type) {
          case 'radio': {
            const handler = createRadioHandler(stores, customValidations);
            el.addEventListener('change', handler);
            changeHandlers.set(el, handler);
            break;
          }
          case 'checkbox': {
            const isMultiple = isMultiCheckbox(name, formElements);
            let updateMultiple;
            if (isMultiple) {
              updateMultiple = checkboxMultiUpdate(name);
            }
            const handler = createCheckHandler(stores, updateMultiple, customValidations);
            el.addEventListener('change', handler);
            changeHandlers.set(el, handler);
            break;
          }
          case 'file': {
            const handler = createFileHandler(stores, customValidations);
            el.addEventListener('change', handler);
            changeHandlers.set(el, handler);
            break;
          }
          case 'range':
          case 'color':
          case 'date':
          case 'time':
          case 'week': {
            const isMultiple = hasMultipleNames(name, formElements);
            let updateMultiple;
            if (isMultiple) {
              updateMultiple = inputMultiUpdate(name, options?.locale);
            }
            const handler = createValueHandler(stores, updateMultiple, customValidations);
            el.addEventListener('change', handler);
            changeHandlers.set(el, handler);
            break;
          }
          default:
            const isMultiple = hasMultipleNames(name, formElements);
            let updateMultiple;
            if (isMultiple) {
              updateMultiple = inputMultiUpdate(name, options?.locale);
            }
            const handler = createValueHandler(stores, updateMultiple, customValidations);
            el.addEventListener('keyup', handler);
            keyupHandlers.set(el, handler);
        }
      }
    });

    let unsub = () => {};
    if (options?.formValidators) {
      unsub = checkFormValidity(stores, options.formValidators);
    }

    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(stores);
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
