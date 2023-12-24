describe('menu user spec', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.mr-2 > .p-element.ng-star-inserted > .p-ripple').click();
    cy.loginAsUser1();
  });

  it('logins', () => {
    cy.get('.p-message-detail').should('be.visible');
  });

  describe('user menu option', () => {
    beforeEach(() => {
      // open menu
      cy.get('.mr-2 > p-button.p-element > .p-ripple > .pi').click();
    });

    it('logouts', () => {
      cy.get('#pn_id_13_3 > .p-menuitem-content > .p-ripple').click();
      cy.get('.p-message-detail').should('be.visible');
    });

    it('opens orders page', () => {
      cy.get(
        '#pn_id_13_0 > .p-menuitem-content > .p-ripple > .p-menuitem-text'
      ).click();
      cy.get(
        ':nth-child(1) > .xl\\:flex-row > .sm\\:flex-row > .sm\\:flex-column > p-button.p-element > .p-ripple > .pi'
      ).should('be.visible');
    });

    it('updates user profile', () => {
      cy.get(
        '#pn_id_13_1 > .p-menuitem-content > .p-ripple > .p-menuitem-text'
      ).click();
      cy.get('[icon="pi pi-check"] > .p-ripple > .p-button-label').should(
        'be.visible'
      );
      cy.get('#phone').should('be.enabled');
      cy.get('[icon="pi pi-check"] > .p-ripple > .p-button-label').click();
      cy.get('.p-message-wrapper').should('be.visible');
    });

    it('updates credentials', () => {
      cy.get(
        '#pn_id_13_2 > .p-menuitem-content > .p-ripple > .p-menuitem-text'
      ).click();
      cy.get('#password > .p-password > .p-inputtext').type('password');
      // Password control shows weakness which covers the password2 for some time, force typing in it
      cy.get('#password2 > .p-password > .p-inputtext').type('password', {
        force: true,
      });
      cy.get('[icon="pi pi-check"] > .p-ripple > .p-button-label').click();
      cy.get('.p-message-wrapper').should('be.visible');
    });
  });
});
