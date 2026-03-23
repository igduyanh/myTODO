// ***********************************************
// Custom Commands cho Cypress Testing
// https://on.cypress.io/custom-commands
// ***********************************************

// ===== Utility Command =====

Cypress.Commands.add('waitUI', (ms = 300) => {
  cy.wait(ms);
});

// ===== E2E Commands - Thao tác trên toàn trang =====

Cypress.Commands.add('addTodo', (text) => {
  cy.get('.header input').type(`${text}{enter}`);
  cy.waitUI();
});

Cypress.Commands.add('toggleTodo', (index = 0) => {
  cy.get('.todo-list li input[type=checkbox]').eq(index).check();
  cy.waitUI();
});

Cypress.Commands.add('deleteTodo', (index = 0) => {
  cy.get('.todo-list li .btn-danger').eq(index).click();
  cy.waitUI();
});

Cypress.Commands.add('editTodo', (index, newText) => {
  cy.get('.todo-list li .btn-primary').eq(index).click();
  cy.waitUI();
  cy.get('.todo-list li input.form-control').should('exist').and('have.focus').type(`{selectall}${newText}`);
  cy.waitUI();
});

Cypress.Commands.add('toggleAll', (check = true) => {
  if (check) {
    cy.get('#toggle-all').check();
  } else {
    cy.get('#toggle-all').uncheck();
  }
  cy.waitUI();
});

Cypress.Commands.add('filterTodos', (filter) => {
  cy.contains('button', filter).click();
  cy.waitUI();
});

Cypress.Commands.add('clearCompleted', () => {
  cy.contains('button', 'Clear completed').click();
  cy.waitUI();
});

Cypress.Commands.add('verifyTodoCount', (count) => {
  cy.get('.todo-list li').should('have.length', count);
});

Cypress.Commands.add('verifyTodoText', (index, text) => {
  cy.get('.todo-list li').eq(index).should('contain.text', text);
});

Cypress.Commands.add('verifyTodoClass', (index, className) => {
  cy.get('.todo-list li').eq(index).should('have.class', className);
});

Cypress.Commands.add('verifyItemsLeft', (count) => {
  const label = count === 1 ? '1 item left' : `${count} items left`;
  cy.contains(label).should('exist');
});

Cypress.Commands.add('verifyTodoButtons', (index = 0) => {
  cy.get('.todo-list li').eq(index).within(() => {
    cy.get('input[type=checkbox]').should('exist');
    cy.get('.btn-primary').should('exist').and('contain.text', 'Edit');
    cy.get('.btn-danger').should('exist').and('contain.text', 'Delete');
  });
});

Cypress.Commands.add('verifyAllChecked', (checked = true) => {
  cy.get('.todo-list li input[type=checkbox]').each(($el) => {
    cy.wrap($el).should(checked ? 'be.checked' : 'not.be.checked');
  });
});

// ===== Component Commands - Thao tác trên component đơn lẻ =====

Cypress.Commands.add('clickToggleBtn', () => {
  cy.get('input[type=checkbox]').click();
});

Cypress.Commands.add('clickDeleteBtn', () => {
  cy.get('.btn-danger').click();
});

Cypress.Commands.add('clickEditBtn', () => {
  cy.get('.btn-primary').click();
});

Cypress.Commands.add('typeItemInput', (text) => {
  cy.get('input.form-control').clear().type(text);
});

Cypress.Commands.add('cancelEditItem', () => {
  cy.get('input.form-control').type('{esc}');
});

Cypress.Commands.add('verifyEditInputVisible', () => {
  cy.get('input.form-control').should('exist').and('be.visible');
});