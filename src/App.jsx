import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TodoForm({ onAdd }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError('Please enter a todo.');
      return;
    }
    onAdd(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Add a new todo"
        style={{ padding: 8, width: 220, marginRight: 8 }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>
        Add
      </button>
      {error && (
        <div style={{ color: 'red', marginTop: 8, fontSize: 14 }}>{error}</div>
      )}
    </form>
  );
}

TodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired
};

function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return <div style={{ color: '#888', marginTop: 24 }}>No todos yet.</div>;
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #eee'
          }}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            style={{ marginRight: 12 }}
          />
          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#222'
            }}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#e74c3c',
              cursor: 'pointer',
              fontSize: 16,
              marginLeft: 8
            }}
            aria-label="Delete todo"
            title="Delete"
          >
            &times;
          </button>
        </li>
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string,
      completed: PropTypes.bool
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddTodo = (text) => {
    setLoading(true);
    setError('');
    try {
      // Simulate async operation
      setTimeout(() => {
        setTodos((prev) => [
          ...prev,
          {
            id: Date.now(),
            text,
            completed: false
          }
        ]);
        setLoading(false);
      }, 300);
    } catch (err) {
      setError('Failed to add todo.');
      setLoading(false);
    }
  };

  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '48px auto',
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Smart Todo App</h1>
      <TodoForm onAdd={handleAddTodo} />
      {loading && (
        <div style={{ color: '#3498db', marginBottom: 12 }}>Adding...</div>
      )}
      {error && (
        <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>
      )}
      <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
    </div>
  );
}

export default App;