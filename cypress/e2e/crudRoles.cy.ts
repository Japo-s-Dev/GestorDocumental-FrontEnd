describe('CRUD de Roles', () => {
  const roleName = 'testrole';
  const description = 'Descripción del rol de prueba';
  const updatedDescription = 'Descripción actualizada del rol de prueba';

  beforeEach(() => {
    cy.login('demo1', 'welcome'); // Asegúrate de que este comando de login esté configurado correctamente en tus comandos personalizados de Cypress.
    cy.visit('/portal/admin/roles'); // Ajusta la ruta según corresponda a tu aplicación.
    cy.wait(2000); // Espera a que la página cargue completamente.
  });

  it('Crea un nuevo rol', () => {
    // Haz clic en el botón para agregar un rol.
    cy.contains('Agregar Rol').click();

    // Completa el formulario de creación de rol.
    cy.get('input[formControlName="role_name"]').type(roleName);
    cy.get('input[formControlName="description"]').type(description);

    // Haz clic en el botón para guardar el rol.
    cy.get('button.add-role-button').eq(1).click({ force: true });

    // Verifica que el rol haya sido creado.
    cy.contains(roleName).should('exist');

    // Verifica que la alerta de éxito sea visible.
    cy.contains('Rol creado con éxito.').should('be.visible');
  });

  it('Modifica el rol creado', () => {
    // Busca y haz clic en el botón de editar para el rol creado.
    cy.contains(roleName).parent().find('.edit').click();

    // Actualiza la descripción del rol.
    cy.get('input[formControlName="description"]').clear().type(updatedDescription);

    // Guarda los cambios.
    cy.contains('Guardar Cambios').click();

    // Verifica que la descripción haya sido actualizada.
    cy.contains(updatedDescription).should('exist');
    cy.contains('Rol actualizado con éxito.').should('be.visible');
  });

  it('Busca el rol modificado', () => {
    // Busca el rol modificado utilizando la barra de búsqueda.
    cy.get('input[placeholder="Buscar rol..."]').type(roleName);
    cy.contains(roleName).should('exist');
  });

  it('Elimina el rol creado', () => {
    // Busca y haz clic en el botón de eliminar para el rol creado.
    cy.contains(roleName).parent().find('.delete').click();
    cy.contains('Confirmar').click();

    // Verifica que el rol haya sido eliminado.
    cy.contains(roleName).should('not.exist');
    cy.contains('Rol eliminado con éxito.').should('be.visible');
  });
});
