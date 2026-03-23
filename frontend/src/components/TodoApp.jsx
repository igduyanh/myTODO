// src/components/TodoApp.jsx
import React, { useState, useEffect, useRef } from 'react';
import { TodoModel } from '../todoModel';
import { TodoItem } from './TodoItem';
import { TodoFooter } from './TodoFooter';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const newField = useRef(null);

  const modelRef = useRef(new TodoModel('react-todos'));

  useEffect(() => {
    const model = modelRef.current;
    setTodos(model.todos);
    const render = () => setTodos([...model.todos]);
    model.subscribe(render);
  }, []);

  const addTodo = async (title) => {
    if (!title) return;
    await modelRef.current.addTodo(title);
    newField.current.value = '';
  };
  const toggle = async (todo) => await modelRef.current.toggle(todo);
  const destroy = async (todo) => await modelRef.current.destroy(todo);
  const save = async (todo, text) => {
    await modelRef.current.save(todo, text);
    setEditing(null);
  };
  const toggleAll = (e) => modelRef.current.toggleAll(e.target.checked);
  const clearCompleted = () => modelRef.current.clearCompleted();
  const handleFilter = (f) => setFilter(f);

  const shownTodos = todos.filter((todo) => {
    if (filter === 'ACTIVE') return !todo.completed;
    if (filter === 'COMPLETED') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <div className="todoapp card p-3">
      <header className="header mb-3 text-center">
        <h1 className="display-4">Todos</h1>
        <input
          ref={newField}
          className="form-control form-control-lg"
          placeholder="What needs to be done?"
          onKeyDown={async (e) => {
            if (e.key === 'Enter') await addTodo(e.target.value.trim());
          }}
          autoFocus
        />
      </header>

      {todos.length > 0 && (
        <section className="main">
          <div className="form-check mb-2">
            <input
              id="toggle-all"
              className="form-check-input"
              type="checkbox"
              onChange={toggleAll}
              checked={activeCount === 0}
            />
            <label className="form-check-label" htmlFor="toggle-all">
              Mark all as complete
            </label>
          </div>
          <ul className="list-group todo-list">
            {shownTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggle(todo)}
                onDestroy={() => destroy(todo)}
                onEdit={() => setEditing(todo.id)}
                editing={editing === todo.id}
                onSave={(text) => save(todo, text)}
                onCancel={() => setEditing(null)}
              />
            ))}
          </ul>
        </section>
      )}

      {(activeCount > 0 || completedCount > 0) && (
        <TodoFooter
          count={activeCount}
          completedCount={completedCount}
          nowShowing={filter}
          onClearCompleted={clearCompleted}
          onFilter={handleFilter}
        />
      )}
    </div>
  );
}
