describe('admin users spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsAdmin();
    cy.visit('/admin/users');
  });

  it('shows table', () => {
    cy.get('.p-datatable-tbody').should('be.visible');
  });

  it('resets user password', () => {
    cy.get(
      ':nth-child(10) > :nth-child(5) > .flex > [icon="pi pi-key"] > .p-ripple > .pi'
    ).click();
    cy.get('.p-confirm-dialog-reject').click();
  });

  it('toggles user admin', () => {
    cy.get(
      ':nth-child(10) > :nth-child(5) > .flex > [icon="pi pi-shield"] > .p-ripple > .pi'
    ).click();
    cy.get('.p-confirm-dialog-reject > .p-button-label').click();
  });

  it('deletes user', () => {
    cy.get(
      ':nth-child(10) > :nth-child(5) > .flex > [icon="pi pi-trash"] > .p-ripple'
    ).click();
    cy.get('.p-confirm-dialog-reject').click();
  });
});
