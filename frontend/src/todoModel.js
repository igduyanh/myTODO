// src/todoModel.js
export class TodoModel {
  constructor() {
    this.todos = [];
    this.onChanges = [];
    this.fetchTodos();
  }

  async fetchTodos() {
    const res = await fetch('/api/todos');
    const data = await res.json();
    this.todos = data.map((todo) => ({ ...todo, id: todo._id }));
    this.inform();
  }

  subscribe(cb) {
    this.onChanges.push(cb);
  }

  inform() {
    this.onChanges.forEach((cb) => cb());
  }

  async addTodo(title) {
    if (!title) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const todo = await res.json();
    const normalized = { ...todo, id: todo._id };
    this.todos.push(normalized);
    this.inform();
    return normalized;
  }

  async toggle(todoToToggle) {
    const res = await fetch(`/api/todos/${todoToToggle.id}/toggle`, {
      method: 'PATCH',
    });
    const updated = await res.json();
    const normalized = { ...updated, id: updated._id };
    this.todos = this.todos.map((todo) => (todo.id === normalized.id ? normalized : todo));
    this.inform();
  }

  async toggleAll(checked) {
    const promises = this.todos.map((todo) =>
      fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: todo.title, completed: checked }),
      }).then((r) => r.json())
    );
    const updatedItems = await Promise.all(promises);
    this.todos = updatedItems.map((todo) => ({ ...todo, id: todo._id }));
    this.inform();
  }

  async destroy(todoToDelete) {
    await fetch(`/api/todos/${todoToDelete.id}`, { method: 'DELETE' });
    this.todos = this.todos.filter((todo) => todo.id !== todoToDelete.id);
    this.inform();
  }

  async save(todoToSave, text) {
    const res = await fetch(`/api/todos/${todoToSave.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text, completed: todoToSave.completed }),
    });
    const updated = await res.json();
    const normalized = { ...updated, id: updated._id };
    this.todos = this.todos.map((todo) => (todo.id === normalized.id ? normalized : todo));
    this.inform();
  }

  async clearCompleted() {
    await fetch('/api/todos', { method: 'DELETE' });
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.inform();
  }
}
