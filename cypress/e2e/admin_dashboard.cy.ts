describe('admin dashboard spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsAdmin();
  });

  it('shows dashboard', () => {
    cy.get(
      'admin-dashboard-dishes > .surface-card > .flex > p-button.p-element > .p-ripple > .pi'
    ).should('be.visible');
    cy.get('canvas').should('be.visible');
  });
});
