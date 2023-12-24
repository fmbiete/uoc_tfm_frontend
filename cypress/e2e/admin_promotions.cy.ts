describe('admin promotions spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsAdmin();
    cy.visit('/admin/promotions/true');
  });

  it('shows table', () => {
    cy.get('.p-datatable-tbody').should('be.visible');
  });

  it('edit promotion', function () {
    cy.get(
      ':nth-child(1) > :nth-child(5) > .flex > [piniteditablerow=""] > .p-ripple > .pi'
    ).click();
    cy.get('[pcanceleditablerow=""] > .p-ripple > .pi').click();
  });

  it('deletes promotion', function () {
    cy.get(
      ':nth-child(1) > :nth-child(5) > .flex > [icon="pi pi-trash"] > .p-ripple'
    ).click();
    cy.get('.p-confirm-dialog-reject > .p-element').click();
  });
});
