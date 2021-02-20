import { createEnrichField } from 'packages/svelte/formula/src/lib/form/enrichment';

describe('Formula Enrichment', () => {
  let enrich;

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
