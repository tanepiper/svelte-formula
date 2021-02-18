import { CustomValidationMessages, ValidationRule, ValidationRules } from './validation';
import { EnrichFields } from './enrich';

/**
 * Optional settings for Formula
 */
export interface FormulaOptions {
  /**
   * Locale for i18n - currently not used
   */
  locale?: string;
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
