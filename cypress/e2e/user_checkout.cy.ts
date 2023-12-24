describe('checkout spec', () => {
  beforeEach(() => {
    cy.landingPageAddToCart();
    // Go to checkout page
    cy.gotoCartCheckout();

    // Confirm cart
    cy.get(
      '.tfm-actions > [icon="pi pi-shopping-cart"] > .p-ripple > .p-button-label'
    ).click();

    // login
    cy.loginAsUser1();
  });

  it('shows delivery address', () => {
    // Steps control exists
    cy.get('.p-highlight > .p-menuitem-link > .p-steps-number').should(
      'be.visible'
    );
    // Checkbox save as default exists
    cy.get('.p-checkbox-box').should('be.visible');
  });

  describe('confirms order', () => {
    beforeEach(() => {
      // Goes to payment page
      cy.get(
        '.tfm-actions > [icon="pi pi-shopping-cart"] > .p-ripple > .p-button-label'
      ).click();
    });

    it('shows payment screen', () => {
      cy.get('#pn_id_25_header_action > .p-tabview-title').should('be.visible');
    });

    it('pays with credit card', () => {
      cy.get('#cc_name').type('User 1');
      cy.get('#cc_number > .p-inputtext').type('1234 5123 3445 6245');
      cy.get('#cc_expiration > .p-inputtext').type('12/24');
      cy.get('#cc_ccv > .p-inputtext').type('111');
      cy.get(
        '.ng-pristine > .tfm-actions > [icon="pi pi-shopping-cart"] > .p-ripple > .p-button-label'
      ).click();
      cy.get('.p-inline-message-text').should('be.visible');
    });

    it('pays with paypal', () => {
      cy.get('#pn_id_26_header_action > .p-tabview-title').click();
      cy.get(
        '#pn_id_26_content > .tfm-actions > [icon="pi pi-shopping-cart"] > .p-ripple > .p-button-label'
      ).click();
      cy.get('.p-inline-message-text').should('be.visible');
    });

    it('pays with salary reduction', () => {
      cy.get('#pn_id_27_header_action > .p-tabview-title').click();
      cy.get(
        '#pn_id_27_content > .tfm-actions > [icon="pi pi-shopping-cart"] > .p-ripple > .p-button-label'
      ).click();
      cy.get('.p-inline-message-text').should('be.visible');
    });
  });
});
