/**
 * A validation function, it should return null if there is no error, or a string if there is an error
 */
export type ValidationFn = (value: unknown | unknown[]) => string | null;

/**
 * A single validation rule with the name of the rule and validation function
 */
export type ValidationRule = Record<string, ValidationFn>;

/**
 * Custom validation rules for Formula
 */
export type ValidationRules = Record<string, ValidationRule>;

/**
 * Custom validation messages for field errors
 */
export type CustomValidationMessages = Record<string, Record<string, string>>;
