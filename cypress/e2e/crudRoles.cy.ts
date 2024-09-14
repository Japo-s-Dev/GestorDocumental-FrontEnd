describe('CRUD de Roles', () => {
  const roleName = 'testrole';
  const description = 'Descripción del rol de prueba';
  const updatedDescription = 'Descripción actualizada del rol de prueba';

  beforeEach(() => {
    cy.login('demo1', 'welcome');
    cy.visit('/portal/admin/roles');
    cy.wait(2000);
  });

  it('Crea un nuevo rol', () => {
    cy.contains('Agregar Rol').click();

    cy.get('input[formControlName="role_name"]').type(roleName);
    cy.get('input[formControlName="description"]').type(description);

    cy.get('button.add-role-button').eq(1).click({ force: true });

    cy.contains(roleName).should('exist');

    cy.contains('Rol creado con éxito.').should('be.visible');
  });

  it('Modifica el rol creado', () => {

    cy.contains(roleName).parent().find('.edit').click();
    cy.get('input[formControlName="description"]').clear().type(updatedDescription);
    cy.contains('Guardar Cambios').click();

    cy.contains(updatedDescription).should('exist');
    cy.contains('Rol actualizado con éxito.').should('be.visible');
  });

  it('Busca el rol modificado', () => {
    cy.get('input[placeholder="Buscar rol..."]').type(roleName);
    cy.contains(roleName).should('exist');
  });

  it('Elimina el rol creado', () => {
    cy.contains(roleName).parent().find('.delete').click();
    cy.contains('Confirmar').click();

    cy.contains(roleName).should('not.exist');
    cy.contains('Rol eliminado con éxito.').should('be.visible');
  });
});
