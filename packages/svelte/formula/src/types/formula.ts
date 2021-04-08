import { Writable } from 'svelte/store';
import { FormulaError } from './forms';
import { FormulaOptions } from './options';

/**
 * Internal type for object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormulaValue = Record<string, any>;
export type FormulaValueDefault = Record<string, unknown>;

/**
 * The stores available in Formula
 */
export interface FormulaStores<T extends FormulaValue = FormulaValueDefault> {
  /**
   * A store containing the current form values
   */
  formValues: Writable<T>;
  /**
   * A store containing the values at the time of `<form>` submission
   */
  submitValues: Writable<T>;
  /**
   * A store containing the initial values
   */
  initialValues: Writable<T>;
  /**
   * A store containing the touched status of each named field
   */
  touched: Writable<Record<string, boolean>>;
  /**
   * A store containing the dirty status of each named field
   */
  dirty: Writable<Record<string, boolean>>;
  /**
   * A store containing the current validity of all named fields from HTML and custom validations
   */
  validity: Writable<Record<string, FormulaError>>;
  /**
   * A store containing the current validity of all custom form validations
   */
  formValidity: Writable<Record<string, string | null>>;
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
  enrichment: Writable<Record<string, T>>;
}

/**
 * The Formula interface with stores and form factory
 */
export interface Formula<T extends FormulaValue = FormulaValueDefault> extends FormulaStores<T> {
  /**
   * The form object for use with the Svelte use directive
   * @param node
   */
  form: (node: HTMLElement) => { destroy: () => void };
  /**
   * Update
   */
  updateForm: (updatedOpts?: FormulaOptions<T>) => void;
  /**
   * Destroy
   */
  destroyForm: () => void;
  /**
   * Resets the form to the initial value
   */
  resetForm: () => void;
  /**
   * Stores
   */
  stores: FormulaStores<T>;
}
