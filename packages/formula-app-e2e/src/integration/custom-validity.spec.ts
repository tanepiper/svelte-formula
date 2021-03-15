import { getFormValid, getInputByName } from '../support/app.po';

describe('Formula - Custom Validity', () => {
  let submit;

  beforeEach(() => {
    cy.visit('/#/test-2');
    submit = cy.get('button[type=submit]');
  });

  it('should display the default form', () => {
    const errors = cy.get('span.error');
    errors.its('length').should('equal', 1);
  });

  it('should show an custom validation error', () => {
    const input = getInputByName('field1');
    input.find('~ span').contains('You must include the word Svelte');
  });

  it('should show custom validation error on incorrect value', () => {
    const input = getInputByName('field1');
    input.type('Test');
    input.find('~ span').contains('You must include the word Svelte');
  });

  it('should remove custom validation error', () => {
    const input = getInputByName('field1');
    input.type('I Love Svelte');
    input.find('~ span:visible').should('not.exist');
  });

  it('should show form as valid with no errors', () => {
    const input = getInputByName('field1');
    input.type('I Love Svelte');

    getFormValid().should('be.visible');
  });
});
