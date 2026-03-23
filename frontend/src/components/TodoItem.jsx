import React, { useState, useEffect, useRef } from 'react';

export function TodoItem({ todo, onToggle, onDestroy, onEdit, editing, onSave, onCancel }) {
  const [editText, setEditText] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [editing]);

  const handleSubmit = () => {
    const val = editText.trim();
    if (val) onSave(val);
    else onDestroy();
  };

  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${
        todo.completed ? 'list-group-item-success' : ''
      } ${editing ? 'editing' : ''}`}
    >
      {!editing ? (
        <>
          <div className="form-check flex-grow-1">
            <input
              className="form-check-input"
              type="checkbox"
              checked={todo.completed}
              onChange={onToggle}
              id={todo.id}
            />
            <label className="form-check-label ms-2" htmlFor={todo.id}>
              {todo.title}
            </label>
          </div>
          <div className="btn-group btn-group-sm">
            <button className="btn btn-primary rounded rounded-2 me-2" onClick={onEdit}>
              Edit
            </button>
            <button className="btn btn-danger rounded rounded-2" onClick={onDestroy}>
              Delete
            </button>
          </div>
        </>
      ) : (
        <input
          ref={inputRef}
          className="form-control"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') {
              setEditText(todo.title);
              onCancel();
            }
          }}
        />
      )}
    </li>
  );
}
