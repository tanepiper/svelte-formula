import { CustomValidationMessages, ValidationRule, ValidationRules } from './validation';
import { EnrichFields } from './enrich';
import { FormulaValue } from '../types/formula';

interface BaseOptions {
  /**
   * Provide customised messages to the application, these messages replace the default browser messages for the provided
   * error types and are useful for internationalisation or custom domain messages
   */
  messages?: CustomValidationMessages;
  /**
   * An object containing validation rules for the provided fields, each field validation returns a string if invalid,
   * or `null` if the validation passes. Each validation key is also added to the `validity` field errors object
   */
  validators?: ValidationRules;
  /**
   * An object containing validation rules for the entire form, validation returns a string if invalid,
   * or `null` if the validation passes. Each validation key is also added to the `formValidity` field errors object
   */
  formValidators?: ValidationRule;
  /**
   * An object containing enrichment functions for the provided fields, each field enrichment returns a value
   * Each function result is available in the `enrichment` store
   */
  enrich?: EnrichFields;
}

/**
 * Optional settings for Formula
 */
export interface FormulaOptions<T extends FormulaValue = Record<string, unknown>> extends BaseOptions {
  /**
   * Default values are used as initial values for the form fields if there is no value already set on the form
   */
  defaultValues?: T;
  /**
   * Method called as soon as a change has been detected, before any values are read or stores are updated
   */
  preChanges?: () => void;
  /**
   * Method called after all updates to the stores have been made
   */
  postChanges?: (values: T) => void;
}

/**
 * Optional settings for Beaker
 */
export interface BeakerOptions<T extends FormulaValue = Record<string, unknown>> extends BaseOptions {
  /**
   * Default values are used as initial values for the form fields if there is no value already set on the form
   */
  defaultValues?: T[];
}
