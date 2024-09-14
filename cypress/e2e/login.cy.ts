describe('Login Functionality', () => {
  it('should log in successfully with valid credentials', () => {

    cy.visit('/login');
    cy.wait(2000);

    cy.get('input[formControlName="username"]').should('be.visible').type('demo1');
    cy.get('input[formControlName="password"]').should('be.visible').type('welcome');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/portal');
  });
});
