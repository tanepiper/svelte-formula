import { Beaker, BeakerStores, Formula, FormulaOptions } from '../../types';
import { createGroupStores } from '../shared/stores';
import { createForm } from '../form/form';

let groupCounter = 0;

/**
 * Creates a group, which is really just a collection of forms for row data
 * @param options
 * @param beakerStores
 */
export function createGroup<T extends Record<string, unknown | unknown[]>>(
  options: FormulaOptions,
  beakerStores: Map<string, BeakerStores<T>>,
): Beaker<T> {
  const stores = createGroupStores<T>(options);
  let groupName;
  let groupParentNode: HTMLElement;
  let globalObserver: MutationObserver;

  const formSet = new Set<Formula<T>>();
  const instanceSet = new Set<{ destroy: () => void }>();

  function destroyGroup() {
    instanceSet.forEach((instance) => instance.destroy());
    formSet.clear();
  }

  function groupHasChanged(rows: HTMLElement[]) {
    rows.forEach((row, i) => {
      const form = createForm<T>(options, undefined, groupName);
      const instance = form.form(row as HTMLElement, true);
      formSet.add(form);
      instanceSet.add(instance);
    });
    stores.isFormReady.set(true);
  }

  /**
   * Set up the Observer for the group
   * @param node
   */
  function setupGroupContainer(node: HTMLElement) {
    globalObserver = new MutationObserver((mutations) => {
      destroyGroup();
      const rows = node.querySelectorAll(':scope > *');
      groupHasChanged(Array.from(rows) as HTMLElement[]);
    });
    globalObserver.observe(node, { childList: true });

    const rows = node.querySelectorAll(':scope > *');
    groupHasChanged(Array.from(rows) as HTMLElement[]);
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
      groupParentNode = node;

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
      [...formSet].forEach((form) => form.updateForm(options));
    },
    reset: () => {
      [...formSet].forEach((form) => form.resetForm());
    },
    destroy: () => {
      if (groupName) {
        beakerStores.delete(groupName);
      }
      destroyGroup();
      globalObserver.disconnect();
    },
    forms: formSet,
    stores: stores,
    init: (items) => stores.formValues.set(items),
    add: (item) => stores.formValues.update((state) => [...state, item]),
    delete: (index) =>
      stores.formValues.update((state) => {
        state.splice(index, 1);
        return state;
      }),
    clear: () => stores.formValues.set([]),
    ...stores,
  };
}
