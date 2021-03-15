import { getFormOutput, getFormValid, getInputByName } from '../support/app.po';

describe('Formula - Basic Form', () => {
  let submit;

  beforeEach(() => {
    cy.visit('/#/test-1');
    submit = cy.get('button[type=submit]');
  });

  it('should display the default form', () => {
    const errors = cy.get('span.error');
    errors.its('length').should('equal', 1);
  });

  it('should set a form field to touched', () => {
    const input = getInputByName('field1');
    input.click();
    input.should('have.attr', 'data-formula-touched', 'true');
  });

  it('should set dirty only on value change', () => {
    const input = getInputByName('field1');
    input.click();
    input.blur();
    input.should('not.have.attr', 'data-formula-dirty', 'true');
    input.click();
    input.type('Test');
    input.blur();
    input.should('have.attr', 'data-formula-dirty', 'true');
  });

  it('should remove error of required field', () => {
    const input = getInputByName('field2');
    input.click();
    input.type('Test');
    cy.get('span.error:visible').should('not.exist');
  });

  it('should show form as valid with no errors', () => {
    const input = getInputByName('field2');
    input.click();
    input.type('Test');

    getFormValid().should('be.visible');
  });

  it('should update reactive store value on page', () => {
    const input = getInputByName('field1');
    input.type('Test');
    getFormOutput(1).should('contain.text', 'Test');
  });
});
