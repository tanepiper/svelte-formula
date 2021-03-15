import { getInputByName } from '../support/app.po';

describe('Formula - Form Enrichment', () => {
  let submit;

  beforeEach(() => cy.visit('/#/test-3'));

  it('should show enrichment', () => {
    const input = getInputByName('field1');
    input.type('I Love Svelte');
    input.find('~ span').contains('13 Characters');
  });
});
