import { Writable } from 'svelte/store';
import { FormulaError } from './forms';
import { FormulaOptions } from './options';

/**
 * The stores available in Formula
 */
export interface FormulaStores<T extends Record<string, unknown | unknown[]>> {
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
  enrichment: Writable<Record<string, Record<string, unknown>>>;
}

/**
 * The Formula interface with stores and form factory
 */
export interface Formula<T extends Record<string, unknown | unknown[]>> extends FormulaStores<T> {
  /**
   * The form object for use with the Svelte use directive
   * @param node
   */
  form: (node: HTMLElement) => { destroy: () => void };
  /**
   * Allows a form's data to be set, this will override any previous default values and become the new ones
   * @param newData
   */
  set: (newData: T) => void;
  /**
   * Update
   */
  updateForm: (updatedOpts?: FormulaOptions) => void;
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
  stores: FormulaStores<Record<string, unknown | unknown[]>>;
}
