import { getAllFieldsWithValidity } from './fields';
import { createHandler, createSubmitHandler } from './event';
import { getInitialValue } from './init';
import { createTouchHandlers } from './touch';
import { createDirtyHandler } from './dirty';
import { FormulaOptions } from '../types/options';
import { createFormValidator } from './errors';
import { FormulaStores } from '../types/formula';
import { FormEl } from 'packages/svelte/formula/src/types/forms';

/**
 * Creates the form action
 * @param options
 * @param stores
 */
export function createForm({
  options,
  ...stores
}: FormulaStores & { options?: FormulaOptions }): [
  (node: HTMLElement) => { destroy: () => void },
  (updatedOpts: FormulaOptions) => void,
  () => void,
] {
  /**
   * Store for all keyup handlers than need removed when destroyed
   */
  const keyupHandlers = new Map<FormEl, () => void>();
  const changeHandlers = new Map<FormEl, () => void>();
  const touchHandlers = new Set<() => void>();
  const dirtyHandlers = new Set<() => void>();

  let submitHandler = undefined;
  let unsub = () => {};

  /**
   * Internal method to do binding of te action element
   * @param node
   * @param innerOpt
   */
  function bindElements(node: HTMLElement, innerOpt: FormulaOptions) {
    const formElements = getAllFieldsWithValidity(node);

    const groupedMap = [
      ...formElements.reduce((entryMap, e) => {
        const name = e.getAttribute('name');
        return entryMap.set(name, [...(entryMap.get(name) || []), e]);
      }, new Map()),
    ];

    groupedMap.forEach(([name, elements]) => {
      touchHandlers.add(createTouchHandlers(name, elements, stores));
      getInitialValue(name, elements, stores, innerOpt);
      dirtyHandlers.add(createDirtyHandler(name, elements, stores));

      elements.forEach((el) => {
        if (el instanceof HTMLSelectElement) {
          changeHandlers.set(el, createHandler(name, 'change', el, elements, stores, innerOpt));
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
              changeHandlers.set(el, createHandler(name, 'change', el, elements, stores, innerOpt));
              break;
            }
            default:
              keyupHandlers.set(el, createHandler(name, 'keyup', el, elements, stores, innerOpt));
          }
        }
      });
    });

    if (innerOpt?.formValidators) {
      unsub = createFormValidator(stores, innerOpt.formValidators);
    }

    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(stores);
      node.addEventListener('submit', submitHandler);
    }
  }

  let currentNode;

  const destroy = () => {
    for (let [key, store] of Object.entries(stores)) {
      if (key === 'isFormValid') {
        store.set(false);
      } else {
        store.set({});
      }
    }
    unsub();
    [...keyupHandlers, ...changeHandlers].forEach(([el, fn]) => {
      el.setCustomValidity('');
      fn();
    });
    [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
    keyupHandlers.clear();
    changeHandlers.clear();
    touchHandlers.clear();
    dirtyHandlers.clear();

    if (submitHandler) {
      currentNode.removeEventListener('submit', submitHandler);
    }
  };

  return [
    (node: HTMLElement) => {
      currentNode = node;
      bindElements(node, options);
      return { destroy };
    },
    (updatedOpts: FormulaOptions) => {
      console.log(currentNode, updatedOpts);
      destroy();
      bindElements(currentNode, updatedOpts);
    },
    destroy,
  ];
}
