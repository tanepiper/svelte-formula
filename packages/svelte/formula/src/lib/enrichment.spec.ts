import { createEnrichField } from 'packages/svelte/formula/src/lib/enrichment';
import { createStores } from 'packages/svelte/formula/src/lib/init';

describe('Formula Enrichment', () => {
  let enrich;

  const stores = createStores();

  beforeEach(() => {
    enrich = createEnrichField('testing', {
      enrich: {
        testing: {
          getLength: (value: string) => value.length,
        },
      },
    });
  });

  it('should update the enrich store', () => {
    const result = enrich('hello');
    expect(result).toStrictEqual({ getLength: 5 });
  });
});
