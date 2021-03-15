export const getGreeting = () => cy.get('h1');

export const getLoginErrors = () => cy.get('.errors');

export const getFormValid = () => cy.get('.form-valid');

export const getFormOutput = (index?: number) => {
  if (typeof index === 'number') {
    return cy.get(`.form-output li:nth-child(${index}) span`);
  }
  return cy.get(`.form-output ul li span`);
};

/**
 * Get an input element by name
 * @param name
 */
export const getInputByName = (name: string) => cy.get(`input[name=${name}]`);
