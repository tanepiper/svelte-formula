import { getAllFieldsWithValidity, getGroupFields } from '../shared/fields';
import { createHandler, createSubmitHandler } from './event';
import { createReset, getInitialFormValues } from './init';
import { createTouchHandlers } from './touch';
import { createDirtyHandler } from './dirty';
import { createFormValidator } from './errors';
import { Form, FormEl, FormulaOptions, FormulaStores } from '../../types';

/**
 * Creates the form action
 * @param options
 * @param stores
 * @param globalStore
 */
export function createForm(
  stores: FormulaStores,
  options: FormulaOptions,
  globalStore?: Map<string, FormulaStores>,
): Form {
  /**
   * Store for all keyup handlers than need removed when destroyed
   */
  const keyupHandlers = new Map<FormEl, () => void>();
  const changeHandlers = new Map<FormEl, () => void>();
  const touchHandlers = new Set<() => void>();
  const dirtyHandlers = new Set<() => void>();

  let currentOptions = options;
  let submitHandler = undefined;
  let unsub;
  let innerReset;
  let groupedMap: [string, FormEl[]][] = [];

  /**
   * Internal method to do binding of te action element
   * @param node
   * @param innerOpt
   * @param isGroup
   */
  function bindElements(node: HTMLElement, innerOpt: FormulaOptions, isGroup?: boolean) {
    const formElements = isGroup ? getGroupFields(node) : getAllFieldsWithValidity(node);

    // Group elements by name
    groupedMap = [
      ...formElements.reduce((entryMap, e) => {
        const name = e.getAttribute('name');
        return entryMap.set(name, [...(entryMap.get(name) || []), e]);
      }, new Map()),
    ];

    getInitialFormValues(groupedMap, stores, innerOpt);
    innerReset = createReset(groupedMap, stores, innerOpt);

    // Loop over each group and setup up their initial touch and dirty handlers,
    // also get initial values
    groupedMap.forEach(([name, elements]) => {
      touchHandlers.add(createTouchHandlers(name, elements, stores));
      dirtyHandlers.add(createDirtyHandler(name, elements, stores));

      // Loop over each element and hook in it's handler
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

    // If form validator options are passed, create a subscription to it
    if (innerOpt?.formValidators) {
      unsub = createFormValidator(stores, innerOpt.formValidators);
    }

    // If the field has a global store, set the ID
    if (node.id && globalStore) {
      globalStore.set(node.id, stores);
    }

    // If the HTML element attached is a form, also listen for the submit event
    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(stores);
      node.addEventListener('submit', submitHandler);
    }
    stores.isFormReady.set(true);
  }

  // Keep a instance of the passed node around
  let currentNode;

  /**
   * Method called when updating or destoying the form, this removes all existing handlers
   * and cleans up
   */
  function cleanupSubscriptions() {
    unsub && unsub();
    [...keyupHandlers, ...changeHandlers].forEach(([el, fn]) => {
      el.setCustomValidity('');
      fn();
    });
    [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
    [keyupHandlers, changeHandlers, touchHandlers, dirtyHandlers].forEach((h) => h.clear());

    if (submitHandler) {
      currentNode.removeEventListener('submit', submitHandler);
    }
  }

  return {
    create: (node: HTMLElement, isGroup?: boolean) => {
      currentNode = node;
      bindElements(node, options, isGroup);
      return {
        destroy: () => {
          cleanupSubscriptions();
          currentNode.id && globalStore && globalStore.delete(name);
        },
      };
    },
    update: (updatedOpts?: FormulaOptions) => {
      stores.isFormReady.set(false);
      cleanupSubscriptions();
      if (updatedOpts) {
        currentOptions = updatedOpts;
      }
      bindElements(currentNode, currentOptions);
    },
    destroy: () => {
      stores.isFormReady.set(false);
      cleanupSubscriptions();
      currentNode.id && globalStore && globalStore.delete(name);
    },
    reset: () => {
      innerReset();
      [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
      groupedMap.forEach(([name, elements]) => {
        touchHandlers.add(createTouchHandlers(name, elements, stores));
        dirtyHandlers.add(createDirtyHandler(name, elements, stores));
      });
    },
    stores,
  };
}
