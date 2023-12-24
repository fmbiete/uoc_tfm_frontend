describe('landing page spec', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads content', () => {
    cy.contains('Universitat Oberta de Catalunya');
  });

  it('hero clicks open new page', function () {
    // click hero button
    cy.get('.px-4 > .p-ripple').click();
    cy.get('h1').should('be.visible');
  });

  it('promotion click opens details', function () {
    cy.get(
      'dishes-home-promotions-list > .surface-section > .grid > :nth-child(1) > dishes-home-item > .col > .relative > picture > .w-full'
    ).click();
    cy.get(':nth-child(4) > .p-element > .p-icon').should('be.visible');
  });

  it('favourite click opens details', function () {
    cy.get(
      'dishes-home-favourites-list > .surface-section > .grid > :nth-child(1) > dishes-home-item > .col > .relative > picture > .w-full'
    ).click();
    cy.get(':nth-child(4) > .p-element > .p-icon').should('be.visible');
  });

  it('changes language', function () {
    cy.get('[aria-labelledby="Spanish"]').click();
    cy.contains('Nuestros Favoritos');
  });

  describe('categories menu', () => {
    beforeEach(() => {
      // Open categories menu burger
      cy.get(
        'dishes-menu-category > p-button.p-element > .p-ripple > .pi'
      ).click();
    });

    it('shows categories', function () {
      cy.get(
        '#pn_id_9_1 > .p-menuitem-content > .p-ripple > .p-menuitem-text'
      ).should('be.visible');
    });

    it('opens category dishes', () => {
      cy.get(
        '#pn_id_9_0 > .p-menuitem-content > .p-ripple > .p-menuitem-text'
      ).click();
      cy.get(
        ':nth-child(1) > .p-4 > :nth-child(3) > p-button.p-element > .p-ripple > .pi'
      ).should('be.visible');
    });
  });

  it('opens search page', function () {
    cy.get('dishes-menu-search > p-button.p-element > .p-ripple').click();
    cy.get('.p-inputtext').should('be.visible');
  });
});
