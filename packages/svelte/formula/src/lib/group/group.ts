import { BeakerStores, Form, FormulaOptions, FormValues } from '../../types';
import { createFormStores } from '../shared/stores';
import { createForm } from '../form/form';

/**
 * Creates a group, which is really just a collection of forms for row data
 * @param stores
 * @param options
 * @param beakerStores
 */
export function createGroup<T extends FormValues>(
  stores: BeakerStores<T>,
  options: FormulaOptions,
  beakerStores: Map<string, BeakerStores<T>>,
): {
  create: (node: HTMLElement) => { destroy: () => void };
  destroy: () => void;
  reset: () => void;
  forms: Set<Form<T>>;
} {
  let groupId;
  let groupParentNode: HTMLElement;
  let globalObserver: MutationObserver;

  const formSet = new Set<Form<T>>();
  const instanceSet = new Set<{ destroy: () => void }>();
  const subscriptions = new Map<string, (() => {})[]>();

  function destroyGroup() {
    [...subscriptions].forEach(([key, subs]) => {
      if (key === 'isFormValid' || key === 'isFormReady') {
        stores[key].set(false);
      } else {
        stores[key].set([]);
      }
      subs.forEach((sub) => sub());
    });
    subscriptions.clear();
    instanceSet.forEach((instance) => instance.destroy());
    formSet.clear();
  }

  function groupHasChanged(rows: HTMLElement[]) {
    destroyGroup();

    rows.forEach((row, i) => {
      const formStore = createFormStores<T>(options);
      const form = createForm<T>(formStore, options);
      const instance = form.create(row as HTMLElement, true);
      formSet.add(form);
      instanceSet.add(instance);

      Object.entries(formStore).forEach(([key, store]) => {
        const unsub = store.subscribe((value) => {
          stores[key].update((state) => {
            if (Array.isArray(state)) {
              state.splice(i, 1, value);
            } else {
              state = value;
            }
            return state;
          });
        });

        if (!subscriptions.has(key)) {
          subscriptions.set(key, [unsub]);
        } else {
          const subs = subscriptions.get(key);
          subs.push(unsub);
          subscriptions.set(key, subs);
        }
      });
    });
    stores.isFormReady.set(true);
  }

  function setupGroupContainer(node: HTMLElement) {
    node.setAttribute('data-beaker-group', 'true');
    node.setAttribute('role', 'beaker-group');

    globalObserver = new MutationObserver((mutations) => {
      const rows = node.querySelectorAll(':scope > *');
      groupHasChanged(Array.from(rows) as HTMLElement[]);
    });
    globalObserver.observe(node, { childList: true });

    const rows = node.querySelectorAll(':scope > *');
    groupHasChanged(Array.from(rows) as HTMLElement[]);
  }

  return {
    create: (node: HTMLElement) => {
      groupId = node.id;
      if (groupId) {
        beakerStores.set(groupId, stores);
      }
      groupParentNode = node;
      setupGroupContainer(node);

      return {
        destroy: () => {
          if (groupId) {
            beakerStores.delete(groupId);
          }
          destroyGroup();
          globalObserver.disconnect();
        },
      };
    },
    reset: () => {
      [...formSet].forEach((form) => form.reset());
    },
    destroy: () => {
      if (groupId) {
        beakerStores.delete(groupId);
      }
      destroyGroup();
      globalObserver.disconnect();
    },
    forms: formSet,
  };
}
