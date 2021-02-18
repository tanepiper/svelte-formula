/**
 * Enrich function is used with field data to generate an enrichment
 */
export type EnrichFn = (value: unknown | unknown[]) => unknown;

/**
 * A single validation rule with the name of the rule and validation function
 */
export type EnrichValue = Record<string, EnrichFn>;

/**
 * Custom validation rules for Formula
 */
export type EnrichFields = Record<string, EnrichValue>;
