import { createStores } from './stores';
import { get } from 'svelte/store';

describe('Formula Stores', () => {
  it('should create empty default stores', () => {
    const stores = createStores();
    expect(get(stores.formValues)).toStrictEqual({});
  });

  it('should create store with default values', () => {
    const stores = createStores({
      defaultValues: {
        foo: 'testing',
        bar: 'formula',
      },
    });
    expect(get(stores.formValues)).toStrictEqual({ foo: 'testing', bar: 'formula' });
  });

  it('should create store with default validity', () => {
    const stores = createStores({
      defaultValues: {
        foo: 'testing',
      },
    });
    expect(get(stores.validity)).toStrictEqual({
      foo: {
        valid: true,
        invalid: false,
        message: '',
        errors: {},
      },
    });
  });

  it('should create store with default touched', () => {
    const stores = createStores({
      defaultValues: {
        foo: 'testing',
      },
    });
    expect(get(stores.touched)).toStrictEqual({ foo: false });
  });

  it('should create store with default dirty', () => {
    const stores = createStores({
      defaultValues: {
        foo: 'testing',
      },
    });
    expect(get(stores.dirty)).toStrictEqual({ foo: false });
  });

  it('should create store with default enrichment', () => {
    const stores = createStores({
      defaultValues: {
        foo: 'testing',
      },
      enrich: {
        foo: {
          valueLength: (value: string) => value.length,
        },
      },
    });
    expect(get(stores.enrichment)).toStrictEqual({
      foo: {
        valueLength: 7,
      },
    });
  });
});
