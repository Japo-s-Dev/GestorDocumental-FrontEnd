/// <reference types="cypress" />

// Define el comando personalizado 'login'
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'https://server.evoluciona.com.gt/api/login', // Ajusta la URL de tu API de login
    body: {
      username: username,
      pwd: password,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    // Verifica que la respuesta sea exitosa
    expect(response.status).to.eq(200);

    // Guarda la cookie o token si es necesario
    cy.setCookie('auth_token', response.body.authToken || ''); // Cambia 'auth_token' al nombre de la cookie o token real
  });
});

// Extiende Cypress con el tipo correcto
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para realizar el login
       * @example cy.login('demo1', 'welcome')
       */
      login(username: string, password: string): Chainable<void>;
    }
  }
}

// Exporta una declaración vacía para convertir el archivo en un módulo
export {};
