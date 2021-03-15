import { getFormOutput, getFormValid, getInputByName } from '../support/app.po';

describe('Formula - Form Validity', () => {
  let submit;

  beforeEach(() => {
    cy.visit('/#/test-4');
  });

  it('should show an error after typing in first field', () => {
    const input = getInputByName('field1');
    input.type('Test');

    getFormOutput(1).should('contain.text', 'The values must match');
  });

  it('should show an error when types values dont match', () => {
    const input1 = getInputByName('field1');
    input1.click();
    input1.type('Test');

    const input2 = getInputByName('field2');
    input2.click();
    input2.type('Testing');
    getFormOutput(1).should('contain.text', 'The values must match');
  });

  it('should remove the error when the fields match', () => {
    const input1 = getInputByName('field1');
    input1.click();
    input1.type('Testing');

    const input2 = getInputByName('field2');
    input2.click();
    input2.type('Testing');
    getFormOutput(1).should('not.be.visible');
  });

  it('should show a valid form', () => {
    const input1 = getInputByName('field1');
    input1.click();
    input1.type('Testing');

    const input2 = getInputByName('field2');
    input2.click();
    input2.type('Testing');
    getFormValid().should('be.visible');
  });
});
