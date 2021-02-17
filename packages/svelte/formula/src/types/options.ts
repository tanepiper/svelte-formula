import { CustomValidationMessages, ValidationRules, ValidationRule } from './validation';

/**
 * Optional settings for Formula
 */
export interface FormulaOptions {
  /**
   * Locale for i18n - currently not used
   */
  locale?: string;
  /**
   * Customised validity messages for each field error type
   */
  messages?: CustomValidationMessages;
  /**
   * Custom Validators for fields
   */
  validators?: ValidationRules;

  /**
   * Validation rules for the entire form
   */
  formValidators?: ValidationRule;
}
