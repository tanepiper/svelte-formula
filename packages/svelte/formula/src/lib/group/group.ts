import { Beaker, BeakerOptions, BeakerStores, Formula, FormulaOptions } from '../../types';
import { createGroupStores } from '../shared/stores';
import { createForm } from '../form/form';
import { get } from 'svelte/store';

let groupCounter = 0;

/**
 * Creates a group, which is really just a collection of forms for row data
 * @param options
 * @param beakerStores
 */
export function createGroup<T extends {} = Record<string, unknown>>(
  options: BeakerOptions,
  beakerStores: Map<string, BeakerStores<T>>,
): Beaker<T> {
  const groupStores = createGroupStores<T>(options);
  let groupName;
  let globalObserver: MutationObserver;

  const { defaultValues, ...formulaOptions } = options || {};

  const formulaInstances = new Map<HTMLElement, Formula<T>>();
  const formInstances = new Map<HTMLElement, { destroy: () => void }>();
  const subscriptions = new Set<() => void>();

  /**
   * Called when the group forms need destroyed
   */
  function destroyGroup() {
    formInstances.forEach((instance) => instance.destroy());
    subscriptions.forEach((sub) => sub());
    formInstances.clear();
    formulaInstances.clear();
    subscriptions.clear();
  }

  /**
   * Cleanup stores if there has been items removed, this will be updated with new store data
   * @param rows
   */
  function cleanupStores(rows: HTMLElement[]) {
    for (const key of Object.keys(groupStores)) {
      if (['formValues', 'initialValues', 'submitValues'].includes(key)) return;
      groupStores[key].update((state) => (Array.isArray(state) ? state.slice(0, rows.length) : state));
    }
  }

  /**
   * Setup subscriptions to child stores when we re-create each form
   * @param form
   * @param index
   */
  function setupSubscriptions(form: Formula<T>, index: number) {
    let initial = true;
    const formStores = Object.entries(form.stores);
    for (const [key, store] of formStores) {
      const unsub = store.subscribe((value) => {
        if (initial && key === 'formValues') return; // Don't emit the initial change
        groupStores[key].update((state) => {
          if (Array.isArray(state)) {
            state.splice(index, 1, value);
            return state;
          }
          return value;
        });
      });
      subscriptions.add(unsub);
    }
    initial = false;
  }

  /**
   * Handle the change in data in the group, recreate the required forms
   * @param rows
   */
  function groupHasChanged(rows: HTMLElement[]) {
    groupStores.isFormReady.set(false);
    const currentVals = get(groupStores.formValues);
    destroyGroup();
    cleanupStores(rows);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      row.setAttribute('data-beaker-index', `${i}`);
      const form = createForm<T>(formulaOptions, undefined, groupName, currentVals[i]);
      const instance = form.form(row as HTMLElement);
      formulaInstances.set(row, form);
      formInstances.set(row, instance);
      setupSubscriptions(form, i);
    }
    groupStores.isFormReady.set(true);
  }

  /**
   * Set up an observer but use a query for the current scopes child nodes
   * @param node
   */
  function setupGroupContainer(node: HTMLElement) {
    globalObserver = new MutationObserver((mutations) => {
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
        beakerStores.set(groupName, groupStores);
      } else {
        groupName = `beaker-group-${groupCounter++}`;
        node.id = groupName;
      }

      node.setAttribute('data-beaker-group', 'true');
      if (!node.hasAttribute('aria-role')) {
        node.setAttribute('aria-role', 'group');
      }
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
    update: (options?: FormulaOptions<T>) => {
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
    stores: groupStores,
    init: (items: T[]) => groupStores.formValues.set(items),
    add: (item: T) => groupStores.formValues.update((state) => [...state, item]),
    set: (index: number, item: T) =>
      groupStores.formValues.update((state) => {
        state.splice(index, 1, item);
        return state;
      }),
    delete: (index) =>
      Object.keys(groupStores).forEach((key) => {
        groupStores[key].update((state) => {
          if (Array.isArray(state)) {
            state.splice(index, 1);
            return state;
          }
          return state;
        });
      }),
    clear: () => groupStores.formValues.set([]),
    ...groupStores,
  };
}
