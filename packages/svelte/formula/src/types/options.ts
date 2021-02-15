import { CustomValidationRules, ValidationRules } from './validation';

/**
 * Optional settings for Formula
 */
export interface FormulaOptions {
  /**
   * Override locale for sorting
   */
  locale?: string;
  /**
   * Custom Validators for fields
   */
  validators?: CustomValidationRules;

  /**
   * Validation rules for the entire form
   */
  formValidators?: ValidationRules;
}
