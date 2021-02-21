import { Writable } from 'svelte/store';
import { FormulaError, FormulaStores, FormValues } from 'svelte-formula';
import { FormulaOptions } from 'packages/svelte/formula/src/types/options';

/**
 * The stores available in Beaker
 */
export interface BeakerStores {
  /**
   * A store containing the current form values
   */
  formValues: Writable<FormValues[]>;
  /**
   * A store containing the values at the time of `<form>` submission
   */
  submitValues: Writable<FormValues[]>;
  /**
   * A store containing the initial values
   */
  initialValues: Writable<FormValues[]>;
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
  enrichment: Writable<Record<string, Record<string, unknown>>[]>;
}

/**
 * The Formula interface with stores and form factory
 */
export interface Beaker extends BeakerStores {
  /**
   * The form object for use with the Svelte use directive
   * @param node
   */
  form: (node: HTMLElement) => { destroy: () => void };
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
  stores: FormulaStores;
}
