import { Beaker, BeakerOptions, BeakerStores, Formula, FormulaOptions } from '../../types';
import { createGroupStores } from '../shared/stores';
import { createForm } from '../form/form';

let groupCounter = 0;

/**
 * Creates a group, which is really just a collection of forms for row data
 * @param options
 * @param beakerStores
 */
export function createGroup<T extends Record<string, unknown | unknown[]>>(
  options: BeakerOptions,
  beakerStores: Map<string, BeakerStores<T>>,
): Beaker<T> {
  const stores = createGroupStores<T>(options);
  let groupName;
  let globalObserver: MutationObserver;

  const { defaultValues, ...formulaOptions } = options || {};

  const formulaInstances = new Map<HTMLElement, Formula<T>>();
  const formInstances = new Map<HTMLElement, { destroy: () => void }>();

  /**
   * Called when the group forms need destroyed
   */
  function destroyGroup() {
    formInstances.forEach((instance) => instance.destroy());
    formInstances.clear();
    formulaInstances.clear();
  }

  /**
   * Called when a node it removed, it destroys it's form instance
   * @param removedNodes
   */
  function nodesRemoved(removedNodes: HTMLElement[]) {
    for (let i = 0; i < removedNodes.length; i++) {
      const row = removedNodes[i];
      const instance = formInstances.get(row);
      if (instance) {
        instance.destroy();
      }
      formInstances.delete(row);
      formulaInstances.delete(row);
    }
    stores.isFormReady.set(true);
  }

  /**
   * Called when a node is added, creates a new instance of a form for the row
   * @param addedNodes
   */
  function nodesAdded(addedNodes: HTMLElement[]) {
    for (let i = 0; i < addedNodes.length; i++) {
      const row = addedNodes[i];
      const form = createForm<T>({ ...formulaOptions, defaultValues: defaultValues[i] }, undefined, groupName);
      formulaInstances.set(row, form);
      const instance = form.form(row as HTMLElement, true);
      formInstances.set(row, instance);
    }
    stores.isFormReady.set(true);
  }

  /**
   * Set up the Observer for the group
   * @param node
   */
  function setupGroupContainer(node: HTMLElement) {
    globalObserver = new MutationObserver((records) => {
      stores.isFormReady.set(false);
      if (records[0].addedNodes.length > 0) {
        nodesAdded(Array.from(records[0].addedNodes) as HTMLElement[]);
      } else if (records[0].removedNodes.length > 0) {
        nodesRemoved(Array.from(records[0].removedNodes) as HTMLElement[]);
      }
    });
    globalObserver.observe(node, { childList: true });
    const rows = node.querySelectorAll(':scope > *');
    nodesAdded(Array.from(rows) as HTMLElement[]);
  }

  return {
    group: (node: HTMLElement) => {
      if (node.id) {
        groupName = node.id;
        beakerStores.set(groupName, stores);
      } else {
        groupName = `beaker-group-${groupCounter++}`;
        node.id = groupName;
      }

      node.setAttribute('data-beaker-group', 'true');
      node.setAttribute('aria-role', 'group');
      setupGroupContainer(node);

      return {
        destroy: () => {
          if (groupName) {
            beakerStores.delete(groupName);
          }
          destroyGroup();
          globalObserver.disconnect();
        },
      };
    },
    update: (options?: FormulaOptions) => {
      [...formulaInstances].forEach(([_, form]) => form.updateForm(options));
    },
    destroy: () => {
      if (groupName) {
        beakerStores.delete(groupName);
      }
      destroyGroup();
      globalObserver.disconnect();
    },
    forms: formulaInstances,
    stores: stores,
    init: (items) => stores.formValues.set(items),
    add: (item) => stores.formValues.update((state) => [...state, item]),
    set: (index: number, item: T) =>
      stores.formValues.update((state) => {
        state.splice(index, 1, item);
        return state;
      }),
    delete: (index) =>
      stores.formValues.update((state) => {
        state.splice(index, 1);
        return state;
      }),
    clear: () => stores.formValues.set([]),
    ...stores,
  };
}
