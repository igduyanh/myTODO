// Kiểm thử giao diện người dùng (UI) - sử dụng mock API để test hành vi UI
// Không phụ thuộc vào backend thật, chỉ test DOM và tương tác người dùng
describe('Kiểm thử giao diện TodoApp', () => {
  let mockTodos;
  let todos;
  let inputs;

  beforeEach(() => {
    mockTodos = [];

    cy.intercept('GET', '/api/todos', (req) => {
      req.reply({ statusCode: 200, body: mockTodos });
    }).as('getTodos');

    cy.intercept('POST', '/api/todos', (req) => {
      const newTodo = {
        _id: `${Date.now()}`,
        title: req.body.title,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      mockTodos.push(newTodo);
      req.reply({ statusCode: 201, body: newTodo });
    }).as('createTodo');

    cy.intercept('PATCH', '/api/todos/*/toggle', (req) => {
      const tokens = req.url.split('/');
      const id = tokens[tokens.length - 2];
      const todo = mockTodos.find((item) => item._id === id);
      if (!todo) return req.reply({ statusCode: 404, body: { error: 'Todo not found' } });
      todo.completed = !todo.completed;
      req.reply({ statusCode: 200, body: todo });
    }).as('toggleTodo');

    cy.intercept('PUT', '/api/todos/*', (req) => {
      const id = req.url.split('/').pop();
      const todo = mockTodos.find((item) => item._id === id);
      if (!todo) return req.reply({ statusCode: 404 });
      todo.title = req.body.title;
      todo.completed = req.body.completed;
      req.reply({ statusCode: 200, body: todo });
    }).as('saveTodo');

    cy.intercept('DELETE', '/api/todos/*', (req) => {
      const id = req.url.split('/').pop();
      mockTodos = mockTodos.filter((item) => item._id !== id);
      req.reply({ statusCode: 200, body: { success: true } });
    }).as('deleteTodo');

    cy.intercept('DELETE', '/api/todos', (req) => {
      mockTodos = mockTodos.filter((item) => !item.completed);
      req.reply({ statusCode: 200, body: { deletedCount: 1 } });
    }).as('clearCompleted');

    cy.fixture('todos').then((todosData) => {
      todos = todosData.todosList;
      inputs = todosData.inputs;
    });

    cy.visit('/');
    cy.wait('@getTodos');
  });

  it('Thêm nhiều todo, kiểm tra thứ tự và focus', () => {
    todos.forEach((item, index) => {
      cy.addTodo(item);
      cy.verifyTodoText(index, item);
    });

    cy.verifyTodoCount(todos.length);
  });

  it('Chỉnh sửa todo bằng nút Edit (Enter và Escape)', () => {
    cy.addTodo(inputs.item1);

    // Nhấn nút Edit (không dùng dblclick nữa)
    cy.editTodo(0, `${inputs.editedItem}{enter}`);

    cy.verifyTodoText(0, inputs.editedItem);

    // Test ESC để hủy edit
    cy.editTodo(0, `${inputs.cancelEdit}{esc}`);

    cy.verifyTodoText(0, inputs.editedItem);
  });

  it('Xóa todo', () => {
    cy.addTodo(inputs.item1);

    cy.deleteTodo(0);

    cy.verifyTodoCount(0);
  });

  it('Toggle từng todo và toggle tất cả', () => {
    todos.forEach((item) => {
      cy.addTodo(item);
    });

    // Chuyển đổi trạng thái 1 item
    cy.toggleTodo(0);
    cy.verifyTodoClass(0, 'list-group-item-success');

    // Toggle tất cả
    cy.toggleAll(true);
    cy.verifyAllChecked(true);

    cy.toggleAll(false);
    cy.verifyAllChecked(false);
  });

  it('Lọc todo (All / Active / Completed)', () => {
    todos.forEach((item) => {
      cy.addTodo(item);
    });
    cy.waitUI();

    cy.toggleTodo(0);

    // Chế độ Active
    cy.filterTodos('Active');
    cy.verifyTodoCount(2);

    // Completed
    cy.filterTodos('Completed');
    cy.verifyTodoCount(1);
    cy.verifyTodoText(0, inputs.item1);

    // All
    cy.filterTodos('All');
    cy.verifyTodoCount(3);
  });

  it('Xóa tất cả todo đã hoàn thành (Clear completed)', () => {
    todos.forEach((item) => {
      cy.addTodo(item);
    });
    cy.waitUI();

    cy.toggleTodo(0);

    cy.clearCompleted();

    cy.verifyTodoCount(2);
  });

  it('Kiểm tra class UI (completed, editing)', () => {
    cy.addTodo(inputs.item1);

    // completed
    cy.toggleTodo(0);
    cy.verifyTodoClass(0, 'list-group-item-success');

    // editing
    cy.editTodo(0, '');
    cy.verifyTodoClass(0, 'editing');
  });

  it('Kiểm tra thao tác bàn phím khi edit', () => {
    cy.addTodo(inputs.item1);

    cy.editTodo(0, `${inputs.newKeyboardItem}{enter}`);

    cy.verifyTodoText(0, inputs.newKeyboardItem);
  });

  it('Kiểm tra các nút Edit, Delete, Checkbox tồn tại', () => {
    cy.addTodo(inputs.item1);

    cy.verifyTodoButtons(0);
  });

  it('Kiểm tra số lượng item left hiển thị đúng', () => {
    cy.addTodo(inputs.item1);
    cy.addTodo(inputs.item2);

    // Ban đầu: 2 item active
    cy.verifyItemsLeft(2);

    // Check 1 item → còn 1
    cy.toggleTodo(0);
    cy.verifyItemsLeft(1);

    // Check hết → còn 0
    cy.toggleTodo(1);
    cy.verifyItemsLeft(0);
  });
});
