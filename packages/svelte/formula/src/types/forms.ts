/**
 * Single type for use where we want any type of HTML form element, before we narrow
 * down to a single
 * @internal
 */
export type FormEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Internally extracted data from the form element, used to generate other store values
 * @internal
 */
export interface ExtractedFormInfo {
  name: string;
  value: unknown | unknown[];
  valid: boolean;
  message: string;
  errors: Record<string, boolean>;
}

/**
 * An error state for an form input
 */
export interface FormulaError {
  /**
   * If the field is valid
   */
  valid: boolean;
  /**
   * If the field is invalid
   */
  invalid: boolean;
  /**
   * The message returned from the HTML element
   */
  message: string;
  /**
   * The errors from the {@link https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation|Contraint Validation API}
   */
  errors: Record<string, boolean>;
}

/**
 * Form Values
 */
export type FormValues = Record<string, unknown | unknown[]>;

/**
 * Form Errors
 */
export type FormErrors = Record<string, FormulaError>;
