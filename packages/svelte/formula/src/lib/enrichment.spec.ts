import { createEnrichField } from 'packages/svelte/formula/src/lib/enrichment';
import { createStores } from 'packages/svelte/formula/src/lib/init';

describe('Formula Enrichment', () => {
  let enrich;

  const stores = createStores();

  beforeEach(() => {
    enrich = createEnrichField(
      'testing',
      {
        enrich: {
          testing: {
            getLength: (value: string) => value.length,
          },
        },
      },
      stores,
    );
  });

  it('should update the enrich store', () => {
    enrich('hello');
    stores.enrichment.subscribe((value) => {
      expect(value).toStrictEqual({ testing: { getLength: 5 } });
    })();
  });
});
