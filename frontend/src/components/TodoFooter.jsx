// src/components/TodoFooter.jsx
import React from 'react';

export function TodoFooter({ count, completedCount, nowShowing, onClearCompleted, onFilter }) {
  const pluralize = (count, word) => (count === 1 ? word : word + 's');
  const activeTodoWord = pluralize(count, 'item');

  return (
    <footer className="d-flex justify-content-between align-items-center mt-3">
      <span className="fw-bold">
        {count} {activeTodoWord} left
      </span>

      <div className="btn-group">
        <button
          className={`btn btn-outline-secondary btn-sm ${nowShowing === 'ALL' ? 'active' : ''}`}
          onClick={() => onFilter('ALL')}
        >
          All
        </button>
        <button
          className={`btn btn-outline-secondary btn-sm ${nowShowing === 'ACTIVE' ? 'active' : ''}`}
          onClick={() => onFilter('ACTIVE')}
        >
          Active
        </button>
        <button
          className={`btn btn-outline-secondary btn-sm ${nowShowing === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => onFilter('COMPLETED')}
        >
          Completed
        </button>
      </div>

      {completedCount > 0 && (
        <button className="btn btn-danger btn-sm" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
