import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getAllTasks,
  searchTasks,
  filterTasksByStatus,
  filterTasksByPriority,
  deleteTask,
  toggleTaskCompleted,
  updateTask,
  addTask
} from '../services/taskService';
import { DASHBOARD_VIEWS, PRIORITIES } from '../constants';
import TaskEditor from './TaskEditor';

/**
 * TaskList - Displays list of tasks with filtering, searching, and CRUD actions.
 */
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('all');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  // Load tasks on mount and when dependencies change
  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, []);

  // Filter/search tasks when view/priority/search changes
  useEffect(() => {
    filterAndSearchTasks();
    // eslint-disable-next-line
  }, [view, priority, search]);

  const loadTasks = () => {
    setLoading(true);
    setError('');
    try {
      const all = getAllTasks();
      setTasks(all);
    } catch (err) {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchTasks = () => {
    setLoading(true);
    setError('');
    try {
      let filtered = getAllTasks();
      if (view !== 'all') {
        filtered = filterTasksByStatus(view);
      }
      if (priority) {
        filtered = filtered.filter((t) => t.priority === priority);
      }
      if (search.trim()) {
        filtered = filtered.filter((t) =>
          t.text.toLowerCase().includes(search.trim().toLowerCase())
        );
      }
      setTasks(filtered);
    } catch (err) {
      setError('Failed to filter tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setLoading(true);
    setError('');
    try {
      const success = deleteTask(id);
      if (!success) {
        setError('Failed to delete task.');
      }
      loadTasks();
    } catch (err) {
      setError('Failed to delete task.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setLoading(true);
    setError('');
    try {
      const { error: toggleError } = toggleTaskCompleted(id);
      if (toggleError) setError(toggleError);
      loadTasks();
    } catch (err) {
      setError('Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowEditor(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setShowEditor(true);
  };

  const handleSaveTask = (taskData) => {
    setLoading(true);
    setError('');
    try {
      if (editingTask) {
        const { error: updateError } = updateTask(editingTask.id, taskData);
        if (updateError) {
          setError(updateError);
          setLoading(false);
          return;
        }
      } else {
        const { error: addError } = addTask(taskData);
        if (addError) {
          setError(addError);
          setLoading(false);
          return;
        }
      }
      setShowEditor(false);
      setEditingTask(null);
      loadTasks();
    } catch (err) {
      setError('Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingTask(null);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '32px auto',
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: 24
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 10 }}>
        <h2 style={{ flex: 1, margin: 0, fontSize: 22 }}>Tasks</h2>
        <button
          onClick={handleAdd}
          style={{
            padding: '7px 16px',
            background: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          + Add Task
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          style={{
            padding: 7,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 15
          }}
        >
          {DASHBOARD_VIEWS.map((v) => (
            <option key={v.key} value={v.key}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            padding: 7,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 15
          }}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks"
          style={{
            flex: 1,
            minWidth: 120,
            padding: 7,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 15
          }}
        />
      </div>
      {loading && (
        <div style={{ color: '#3498db', marginBottom: 12 }}>Loading...</div>
      )}
      {error && (
        <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>
      )}
      {showEditor && (
        <div style={{ marginBottom: 24 }}>
          <TaskEditor
            initialTask={editingTask}
            onSave={handleSaveTask}
            onCancel={handleCancelEdit}
          />
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.length === 0 && !loading && (
          <li style={{ color: '#888', padding: 16, textAlign: 'center' }}>
            No tasks found.
          </li>
        )}
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}
          >
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => handleToggle(task.id)}
              style={{ marginRight: 12 }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#888' : '#222',
                  fontWeight: 500,
                  fontSize: 16
                }}
              >
                {task.text}
              </div>
              <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
                {task.details && (
                  <span style={{ marginRight: 10 }}>{task.details}</span>
                )}
                {task.dueDate && (
                  <span style={{ marginRight: 10 }}>
                    Due: <b>{task.dueDate}</b>
                  </span>
                )}
                {task.priority && (
                  <span style={{ marginRight: 10 }}>
                    Priority: <b>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</b>
                  </span>
                )}
                {task.recurrence && task.recurrence !== 'none' && (
                  <span style={{ marginRight: 10 }}>
                    Recurs: <b>{task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1)}</b>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleEdit(task)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2980b9',
                cursor: 'pointer',
                fontSize: 16,
                marginLeft: 8
              }}
              aria-label="Edit task"
              title="Edit"
            >
              ✎
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#e74c3c',
                cursor: 'pointer',
                fontSize: 18,
                marginLeft: 8
              }}
              aria-label="Delete task"
              title="Delete"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

TaskList.propTypes = {};

export default TaskList;