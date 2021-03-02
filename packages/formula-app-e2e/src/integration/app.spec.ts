import { getLoginErrors } from '../support/app.po';

describe('formula-app', () => {
  beforeEach(() => cy.visit('/#/login-form'));

  it('should have a form visible', () => {
    getLoginErrors().contains('Your passwords do not match');
  });

  it('should toggle touched on field', () => {
    const input = cy.get('input[name=username]');
    input.click();

    input.should('have.attr', 'data-formula-touched', 'true');
  });

  it('should show an error when not a valid email', () => {
    cy.get('input[name=username]').type('foo').find('~ span').contains("Please include an '@' in the email address");
  });

  it('should show an error when not a valid domain', () => {
    cy.get('input[name=username]').type('foo@bar.com').find('~ span').contains('You in the svelte codes?');
  });
});
