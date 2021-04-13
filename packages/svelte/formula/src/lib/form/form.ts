import { getFormFields, getGroupFields } from '../shared/fields';
import { createHandler, createSubmitHandler } from './event';
import { createReset } from './init';
import { createTouchHandlers } from './touch';
import { createDirtyHandler } from './dirty';

import { FormEl, Formula, FormulaOptions, FormulaStores, FormulaValue, FormulaValueDefault } from '../../types';
import { createFormStores } from '../shared/stores';
import { setAriaButtons, setAriaContainer, setAriaRole, setAriaStates } from './aria';

/**
 * Creates the form action
 * @param options
 * @param globalStore
 * @param groupName
 * @param initialData
 */
export function createForm<T extends FormulaValue = FormulaValueDefault>(
  options: FormulaOptions,
  globalStore?: Map<string, FormulaStores>,
  groupName?: string,
  initialData?: T,
): Formula<T> {
  /**
   * Store for all keyup handlers than need removed when destroyed
   */
  const eventHandlers = new Map<FormEl, () => void>();
  const hiddenGroups = new Map<string, HTMLInputElement[]>();
  const touchHandlers = new Set<() => void>();
  const dirtyHandlers = new Set<() => void>();

  const stores = createFormStores<T>(options, initialData);
  const isGroup = typeof groupName !== 'undefined';
  const initialOptions = options;
  let submitHandler = undefined;
  let unsub: () => void;
  let innerReset: () => void;
  let groupedMap: [string, FormEl[]][] = [];

  /**
   * Internal method to do binding of te action element
   * @param node
   * @param innerOpt
   */
  function bindElements(node: HTMLElement, innerOpt: FormulaOptions) {
    const formElements = isGroup ? getGroupFields(node) : getFormFields(node);

    node.setAttribute(`data-formula-${isGroup ? 'row' : 'form'}`, 'true');
    setAriaContainer(node, isGroup);
    setAriaButtons(node);

    // Group elements by name
    groupedMap = [
      ...formElements.reduce((entryMap, e) => {
        const formulaName = e.dataset.formulaName;
        const name = formulaName || e.getAttribute('name');
        return entryMap.set(name, [...(entryMap.get(name) || []), e]);
      }, new Map()),
    ];

    innerReset = createReset(node, groupedMap, stores, innerOpt);

    // Loop over each group and setup up their initial touch and dirty handlers,
    // also get initial values
    groupedMap.forEach(([name, elements]) => {
      // Special case for hidden fields, put into the hidden set to pass only on form submission
      // as they don't react to event anyway
      if (elements[0].type === 'hidden') {
        hiddenGroups.set(name, elements as HTMLInputElement[]);
        return;
      }

      touchHandlers.add(createTouchHandlers(name, elements, stores));
      dirtyHandlers.add(createDirtyHandler(name, elements, stores));

      // Loop over each element and hook in it's handler
      elements.forEach((el) => {
        if (isGroup) {
          el.setAttribute('data-in-group', groupName);
        }
        setAriaRole(el, elements);
        setAriaStates(el);

        const customBindings = el.dataset.formulaBind;
        if (customBindings) {
          customBindings
            .split('|')
            .forEach((event) =>
              eventHandlers.set(el, createHandler(name, event, el, elements, stores, innerOpt, hiddenGroups)),
            );
        } else if (el instanceof HTMLSelectElement) {
          eventHandlers.set(el, createHandler(name, 'change', el, elements, stores, innerOpt, hiddenGroups));
        } else {
          switch (el.type) {
            case 'radio':
            case 'checkbox':
            case 'file':
            case 'range':
            case 'color': {
              eventHandlers.set(el, createHandler(name, 'change', el, elements, stores, innerOpt, hiddenGroups));
              break;
            }
            case 'date':
            case 'time':
            case 'week':
            case 'number': {
              eventHandlers.set(el, createHandler(name, 'change', el, elements, stores, innerOpt, hiddenGroups));
              eventHandlers.set(el, createHandler(name, 'keyup', el, elements, stores, innerOpt, hiddenGroups));
              break;
            }
            case 'hidden': {
              // Ensure no handlers on hidden fields as
              break;
            }
            default:
              eventHandlers.set(el, createHandler(name, 'keyup', el, elements, stores, innerOpt, hiddenGroups));
          }
        }
      });
    });

    // If the field has a global store, set the ID
    if (node.id && globalStore) globalStore.set(node.id, stores);

    // If the HTML element attached is a form, also listen for the submit event
    if (node instanceof HTMLFormElement) {
      submitHandler = createSubmitHandler(stores, node);
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
    [...eventHandlers].forEach(([el, fn]) => {
      el.setCustomValidity('');
      fn();
    });
    [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
    [eventHandlers, touchHandlers, dirtyHandlers].forEach((h) => h.clear());
    if (submitHandler) currentNode.removeEventListener('submit', submitHandler);
  }

  return {
    /**
     * Create an action for the `use` directive
     * @param node
     */
    form: (node: HTMLElement) => {
      currentNode = node;
      bindElements(node, options);
      return {
        destroy: () => {
          cleanupSubscriptions();
          currentNode.id && globalStore && globalStore.delete(currentNode.id);
        },
      };
    },
    /**
     * Update a form instance , new options can be passed to the form instance, if not it will use the original
     * values passed
     * @param updatedOpts
     */
    updateForm: (updatedOpts?: FormulaOptions) => {
      stores.isFormReady.set(false);
      cleanupSubscriptions();
      bindElements(currentNode, updatedOpts || initialOptions);
    },
    /**
     * Destroy the form instance
     */
    destroyForm: () => {
      stores.isFormReady.set(false);
      cleanupSubscriptions();
      currentNode.id && globalStore && globalStore.delete(currentNode.id);
    },
    /**
     * Reset the data in the form instance
     */
    resetForm: () => {
      innerReset();
      [...touchHandlers, ...dirtyHandlers].forEach((fn) => fn());
      groupedMap.forEach(([name, elements]) => {
        touchHandlers.add(createTouchHandlers(name, elements, stores));
        dirtyHandlers.add(createDirtyHandler(name, elements, stores));
      });
    },
    stores,
    ...stores,
  };
}
