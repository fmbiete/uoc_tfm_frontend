describe('admin orders spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsAdmin();
    cy.visit('/admin/orders/false');
  });

  it('shows table', () => {
    cy.get('.p-datatable-tbody').should('be.visible');
  });
});
