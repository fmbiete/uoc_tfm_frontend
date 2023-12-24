describe('cart spec', () => {
  beforeEach(() => {
    // Add dish to cart
    cy.landingPageAddToCart();
  });

  it('adds dish to cart', function () {
    cy.get('.p-badge-warning').should('be.visible');
  });

  it('changes quantity on cart', () => {
    cy.get('.p-badge-warning').click();
    cy.get('[icon="pi pi-plus"] > .p-ripple > .pi').click();
    cy.get(
      '[aria-label="Quantity Cart Line"] > .p-ripple > .p-button-label'
    ).should('contain', 2);
    cy.get('[icon="pi pi-minus"] > .p-ripple > .pi').click();
    cy.get(
      '[aria-label="Quantity Cart Line"] > .p-ripple > .p-button-label'
    ).should('contain', 1);
  });

  it('deletes cart line', () => {
    cy.get('.p-badge-warning').click();
    cy.get('[icon="pi pi-trash"] > .p-ripple > .pi').click();
    cy.get('.p-badge-warning').should('not.exist');
  });

  it('opens cart page', function () {
    cy.gotoCartCheckout();
    cy.get(
      '.tfm-actions > [icon="pi pi-shopping-cart"] > .p-ripple > .p-button-label'
    ).should('be.visible');
  });
});
