import { getAllFieldsWithValidity } from './fields';
import { createHandler, createSubmitHandler } from './event';
import { getInitialValue } from './init';
import { createTouchHandlers } from './touch';
import { createDirtyHandler } from './dirty';
import { FormulaOptions } from '../types/options';
import { createFormValidator } from './errors';
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
    const keyupHandlers = new Set<() => void>();
    const changeHandlers = new Set<() => void>();
    const touchHandlers = new Set<() => void>();
    const dirtyHandlers = new Set<() => void>();

    let submitHandler = undefined;

    const formElements = getAllFieldsWithValidity(node);

    const groupedMap = [
      ...formElements.reduce((entryMap, e) => {
        const name = e.getAttribute('name');
        return entryMap.set(name, [...(entryMap.get(name) || []), e]);
      }, new Map()),
    ];

    groupedMap.forEach(([name, elements]) => {
      touchHandlers.add(createTouchHandlers(name, elements, stores));
      getInitialValue(name, elements, stores, options);
      dirtyHandlers.add(createDirtyHandler(name, elements, stores));

      elements.forEach((el) => {
        if (el instanceof HTMLSelectElement) {
          changeHandlers.add(createHandler(name, 'change', el, elements, stores, options));
        } else {
          switch (el.type) {
            case 'radio':
            case 'checkbox':
            case 'file':
            case 'range':
            case 'color':
            case 'date':
            case 'time':
            case 'week': {
              changeHandlers.add(createHandler(name, 'change', el, elements, stores, options));
              break;
            }
            default:
              keyupHandlers.add(createHandler(name, 'keyup', el, elements, stores, options));
          }
        }
      });
    });

    let unsub = () => {};
    if (options?.formValidators) {
      unsub = createFormValidator(stores, options.formValidators);
    }

    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(stores);
      node.addEventListener('submit', submitHandler);
    }

    return {
      destroy: () => {
        unsub();
        [...keyupHandlers, ...changeHandlers, ...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
        if (submitHandler) {
          node.removeEventListener('submit', submitHandler);
        }
      },
    };
  };
}
