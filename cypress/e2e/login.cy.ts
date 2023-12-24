describe('login spec', () => {
  it('logins and logouts', function () {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsUser1();
    cy.get('.p-message-detail').should('be.visible');
    // Logout
    cy.get('.mr-2 > p-button.p-element > .p-ripple > .pi').click();
    cy.get('#pn_id_13_3 > .p-menuitem-content > .p-ripple').click();
    cy.get('.p-message-detail').should('be.visible');
  });
});
