/**
 * A validation function, it should return null if there is no error, or a string if there is an error
 */
export type ValidationFn = (value: unknown | unknown[]) => null | string;

/**
 * A single validation rule with the name of the rule and validation function
 */
export type ValidationRules = Record<string, ValidationFn>;

/**
 * Custom validation rules for Formula
 */
export type CustomValidationRules = Record<string, ValidationRules>;
