import { Writable } from 'svelte/store';
import { Formula, FormulaError, FormulaOptions } from '../types';

/**
 * The stores available in Beaker
 */
export interface BeakerStores<T extends {} = Record<string, unknown>> {
  /**
   * A store containing the current form values
   */
  formValues: Writable<T[]>;
  /**
   * A store containing the values at the time of `<form>` submission
   */
  submitValues: Writable<T[]>;
  /**
   * A store containing the initial values
   */
  initialValues: Writable<T[]>;
  /**
   * A store containing the touched status of each named field
   */
  touched: Writable<Record<string, boolean>[]>;
  /**
   * A store containing the dirty status of each named field
   */
  dirty: Writable<Record<string, boolean>[]>;
  /**
   * A store containing the current validity of all named fields from HTML and custom validations
   */
  validity: Writable<Record<string, FormulaError>[]>;
  /**
   * A store containing the current validity of all custom form validations
   */
  formValidity: Writable<Record<string, string | null>[]>;
  /**
   * A store containing a boolean value if the form is overall valid
   */
  isFormValid: Writable<boolean>;
  /**
   * Observable value if the form state is ready to be used
   */
  isFormReady: Writable<boolean>;
  /**
   * A store containing additional field enrichment
   */
  enrichment: Writable<Record<string, Record<string, unknown>>[]>;
}

/**
 * The Formula interface with stores and form factory
 */
export interface Beaker<T extends {} = Record<string, unknown>> extends BeakerStores<T> {
  /**
   * The form object for use with the Svelte use directive
   * @param node
   */
  group: (node: HTMLElement) => { destroy: () => void };
  /**
   * Update all the underlying forms
   */
  update: (options?: FormulaOptions<T>) => void;
  /**
   * Destroy
   */
  destroy: () => void;
  /**
   * Instance forms
   */
  forms: Map<HTMLElement, Formula<T>>;
  /**
   * Stores
   */
  stores: BeakerStores<T>;
  /**
   * Initialise the store
   * @param items
   */
  init: (items: T[]) => void;
  /**
   * Add an item to the group store
   */
  add: (item: T) => void;
  /**
   * Add an item to the group store
   */
  set: (index: number, item: T) => void;
  /**
   * Remove and item from the group store
   */
  delete: (index: number) => void;
  /**
   * Clear all items
   */
  clear: () => void;
}
