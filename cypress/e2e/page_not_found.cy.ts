describe('page not found', () => {
  it('opens custom 404 handler', () => {
    cy.visit('/wrong_url');

    cy.contains('404');
  });
});
