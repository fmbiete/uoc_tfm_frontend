describe('admin ingredients spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsAdmin();
    cy.visit('/admin/ingredients');
  });

  it('shows table', () => {
    cy.get('.p-datatable-tbody').should('be.visible');
  });

  it('edit ingredient', function () {
    cy.get(
      ':nth-child(1) > :nth-child(2) > .flex > [piniteditablerow=""] > .p-ripple'
    ).click();
    cy.get('.mr-2 > .p-ripple').click();
  });

  it('deletes ingredient', function () {
    cy.get(
      ':nth-child(1) > :nth-child(2) > .flex > [icon="pi pi-trash"] > .p-ripple > .pi'
    ).click();
    cy.get('.p-confirm-dialog-reject > .p-element').click();
  });

  it('creates ingredient', function () {
    cy.get('.p-element.ng-star-inserted > .p-ripple > .p-button-label').click();
    cy.get('[icon="pi pi-times"] > .p-ripple > .p-button-label').click();
  });
});
