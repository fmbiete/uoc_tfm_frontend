describe('orders spec', () => {
  beforeEach(() => {
    cy.visit('/');
    // Login
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsUser1();
    //
    cy.visit('/orders');
  });

  it('list orders', () => {
    cy.get(
      ':nth-child(1) > .xl\\:flex-row > .sm\\:flex-row > .sm\\:flex-column > p-button.p-element > .p-ripple > .pi'
    ).should('be.visible');
  });

  describe('order details', () => {
    beforeEach(() => {
      cy.get(
        ':nth-child(1) > .xl\\:flex-row > .sm\\:flex-row > .sm\\:flex-column > p-button.p-element > .p-ripple > .pi'
      ).click();
    });

    it('shows print button', () => {
      cy.get(
        '.sm\\:flex-row > :nth-child(2) > p-button.p-element > .p-ripple > .pi'
      ).should('be.visible');
    });

    it('updates order', function () {
      cy.get(
        '.hidden > .p-inputnumber > .p-inputnumber-button-up > .pi'
      ).click();
      cy.get('[icon="pi pi-save"] > .p-ripple > .p-button-label').click();
      cy.get('.p-confirm-dialog-accept > .p-button-label').click();
    });

    it('cancels order', function () {
      cy.get('.mb-3 > .p-ripple > .p-button-label').click();
      cy.get('.p-confirm-dialog-accept > .p-element').click();
      cy.get('.p-message-wrapper').should('be.visible');
    });
  });
});
