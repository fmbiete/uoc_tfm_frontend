describe('admin dishes spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsAdmin();
    cy.visit('/admin/dishes');
  });

  it('shows table', () => {
    cy.get('.p-datatable-tbody').should('be.visible');
  });

  it('edit dish', function () {
    cy.get(
      ':nth-child(1) > :nth-child(6) > .flex > [icon="pi pi-pencil"] > .p-ripple'
    ).click();
    cy.get('[icon="pi pi-times"] > .p-ripple').click();
  });

  it('deletes dish', function () {
    cy.get(
      ':nth-child(1) > :nth-child(6) > .flex > [icon="pi pi-trash"] > .p-ripple'
    ).click();
    cy.get('.p-confirm-dialog-reject').click();
  });

  it('creates dish', function () {
    cy.get('.p-element.ng-star-inserted > .p-ripple > .p-button-label').click();
    cy.get('[icon="pi pi-times"] > .p-ripple > .p-button-label').click();
  });

  it('creates promotion', function () {
    cy.get(
      '.p-datatable-tbody > :nth-child(1) > :nth-child(1) > p-button.p-element > .p-ripple > .pi'
    ).click();
    cy.get(
      '#pn_id_61 > .p-datatable-header > .flex > p-button.p-element > .p-ripple > .p-button-label'
    ).click();
    cy.get('[icon="pi pi-times"] > .p-ripple').click();
  });
});
