/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('gotoCartCheckout', () => {
  // requires landingPageAddToCart
  cy.get('.p-badge-warning').click();
  cy.get('[icon="pi pi-shopping-cart"] > .p-ripple > .p-button-label').click();
});

Cypress.Commands.add('landingPageAddToCart', () => {
  cy.visit('/');
  cy.get(
    'dishes-home-promotions-list > .surface-section > .grid > :nth-child(1) > dishes-home-item > .col > .relative > p-button.p-element > .p-ripple > .pi'
  ).click();
  cy.get('.p-badge-warning').should('be.visible');
});

Cypress.Commands.add('loginAsUser1', () => {
  const username = 'user1@tfm.es';
  const password = 'password';
  cy.login(username, password);
});

Cypress.Commands.add('loginAsAdmin', () => {
  const username = 'admin@tfm.es';
  const password = 'password';
  cy.login(username, password);
});

Cypress.Commands.add('login', (username, password) => {
  cy.get('#email').type(username);
  cy.get('.p-password > .p-inputtext').type(password);
  cy.get('[icon="pi pi-check"] > .p-ripple > .p-button-label').click();
});
