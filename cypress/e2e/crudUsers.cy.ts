describe('CRUD de Usuarios', () => {
  const username = 'testuser';
  const email = 'testuser@example.com';
  const updatedEmail = 'updateduser@example.com';
  const role = 'ADMIN';
  const updatedRole = 'IT';

  beforeEach(() => {
    cy.login('demo1', 'welcome');
    cy.visit('/portal/admin/users');
    cy.wait(4000);
  });

  it('Crea un nuevo usuario', () => {
    cy.contains('Agregar Usuario').click();

    cy.get('input[formControlName="username"]').type(username);
    cy.get('input[formControlName="password"]').type('sPVP5Rv2!');
    cy.get('input[formControlName="confirmPassword"]').type('sPVP5Rv2!');
    cy.get('input[formControlName="email"]').type(email);
    cy.get('select[formControlName="assigned_role"]').select(role);

    cy.get('button.add-user-button').eq(1).click({ force: true });

    cy.contains(username).should('exist');

    cy.contains('Usuario creado con éxito.').should('be.visible');
  });

  it('Modifica el usuario creado', () => {
    cy.contains(username).parent().find('.edit').click();

    cy.get('input[formControlName="email"]').clear().type(updatedEmail);
    cy.get('select[formControlName="assigned_role"]').select(updatedRole);

    cy.contains('Guardar Cambios').click();

    cy.contains(updatedEmail).should('exist');
    cy.contains(updatedRole).should('exist');
    cy.contains('Usuario actualizado con éxito.').should('be.visible');
  });

  it('Busca el usuario modificado', () => {
    cy.get('input[placeholder="Buscar usuario"]').type(updatedEmail);
    cy.contains(updatedEmail).should('exist');
  });

  it('Elimina el usuario creado', () => {
    // Buscar y eliminar el usuario
    cy.contains(updatedEmail).parent().find('.delete').click();
    cy.contains('Confirmar').click();

    cy.contains(updatedEmail).should('not.exist');
    cy.contains('Usuario eliminado con éxito.').should('be.visible');
  });
});
