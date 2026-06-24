import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getTasksDueToday,
  getAllTasks,
  filterTasksByStatus
} from '../services/taskService';
import { DASHBOARD_VIEWS } from '../constants';

/**
 * DashboardView - Shows Today, Upcoming, Completed task groups with navigation.
 */
function DashboardView() {
  const [view, setView] = useState('today');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line
  }, [view]);

  const loadTasks = () => {
    setLoading(true);
    setError('');
    try {
      let result = [];
      if (view === 'today') {
        result = getTasksDueToday();
      } else if (view === 'upcoming') {
        const all = getAllTasks();
        const now = new Date();
        result = all.filter(
          (t) =>
            t.dueDate &&
            !t.completed &&
            new Date(t.dueDate) > now
        );
        // Sort by due date ascending
        result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else if (view === 'completed') {
        result = filterTasksByStatus('completed');
        // Sort by completed date descending if available, else by dueDate
        result.sort((a, b) => {
          if (a.completedAt && b.completedAt) {
            return new Date(b.completedAt) - new Date(a.completedAt);
          }
          if (a.dueDate && b.dueDate) {
            return new Date(b.dueDate) - new Date(a.dueDate);
          }
          return 0;
        });
      }
      setTasks(result);
    } catch (err) {
      setError('Failed to load dashboard tasks.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
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
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        <button
          onClick={() => setView('today')}
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            borderRadius: 4,
            background: view === 'today' ? '#3498db' : '#eee',
            color: view === 'today' ? '#fff' : '#222',
            fontWeight: view === 'today' ? 600 : 400,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Today
        </button>
        <button
          onClick={() => setView('upcoming')}
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            borderRadius: 4,
            background: view === 'upcoming' ? '#3498db' : '#eee',
            color: view === 'upcoming' ? '#fff' : '#222',
            fontWeight: view === 'upcoming' ? 600 : 400,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Upcoming
        </button>
        <button
          onClick={() => setView('completed')}
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            borderRadius: 4,
            background: view === 'completed' ? '#3498db' : '#eee',
            color: view === 'completed' ? '#fff' : '#222',
            fontWeight: view === 'completed' ? 600 : 400,
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          Completed
        </button>
      </div>
      <h2 style={{ margin: '0 0 18px 0', fontSize: 22 }}>{getTitle()} Tasks</h2>
      {loading && (
        <div style={{ color: '#3498db', marginBottom: 12 }}>Loading...</div>
      )}
      {error && (
        <div style={{ color: '#e74c3c', marginBottom: 12 }}>{error}</div>
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
              readOnly
              style={{ marginRight: 12 }}
              tabIndex={-1}
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
          </li>
        ))}
      </ul>
    </div>
  );
}

DashboardView.propTypes = {};

export default DashboardView;