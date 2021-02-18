import { writable } from 'svelte/store';
import { FormEl, FormulaError, FormValues } from '../types/forms';
import {
  createCheckboxExtract,
  createFieldExtract,
  createFileExtract,
  createRadioExtract,
  createSelectExtract,
} from './extract';
import { FormulaStores } from '../types/formula';
import { FormulaOptions } from '../types/options';
import { valueUpdate } from './event';
import { createEnrichField } from 'packages/svelte/formula/src/lib/enrichment';

/**
 * Get the initial value from the passed elements
 * @param name
 * @param elements
 * @param stores
 * @param options
 */
export function getInitialValue(name: string, elements: FormEl[], stores: FormulaStores, options: FormulaOptions) {
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    let handler;
    if (el instanceof HTMLSelectElement) {
      handler = createSelectExtract(name, options);
    } else {
      switch (el.type) {
        case 'checkbox': {
          handler = createCheckboxExtract(name, elements, options);
          break;
        }
        case 'file': {
          handler = createFileExtract(name, options);
          break;
        }
        case 'radio': {
          handler = createRadioExtract(name, options);
          break;
        }
        default: {
          handler = createFieldExtract(name, elements, options);
        }
      }
    }
    let enrich;
    if (options?.enrich?.[name]) {
      enrich = createEnrichField(name, options, stores);
    }
    valueUpdate(handler(el), stores, enrich);
  }
}

/**
 * Create the stores for the instance
 */
export function createStores(): FormulaStores {
  return {
    formValues: writable<FormValues>({}),
    submitValues: writable<FormValues>({}),
    touched: writable<Record<string, boolean>>({}),
    dirty: writable<Record<string, boolean>>({}),
    validity: writable<Record<string, FormulaError>>({}),
    formValidity: writable<Record<string, string>>({}),
    isFormValid: writable<boolean>(false),
    enrichment: writable<Record<string, Record<string, unknown>>>({}),
  };
}
