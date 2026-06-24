import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PRIORITIES, RECURRENCE_OPTIONS } from '../constants';

/**
 * TaskEditor - Form for creating or editing a task.
 * Props:
 *   - initialTask: object (optional, for editing)
 *   - onSave: function(taskData)
 *   - onCancel: function()
 */
function TaskEditor({ initialTask, onSave, onCancel }) {
  const [text, setText] = useState(initialTask?.text || '');
  const [details, setDetails] = useState(initialTask?.details || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'medium');
  const [recurrence, setRecurrence] = useState(initialTask?.recurrence || 'none');
  const [tags, setTags] = useState(initialTask?.tags?.join(', ') || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setText(initialTask.text || '');
      setDetails(initialTask.details || '');
      setDueDate(initialTask.dueDate || '');
      setPriority(initialTask.priority || 'medium');
      setRecurrence(initialTask.recurrence || 'none');
      setTags(initialTask.tags?.join(', ') || '');
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Task title is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const taskData = {
        ...initialTask,
        text: text.trim(),
        details: details.trim(),
        dueDate: dueDate || null,
        priority,
        recurrence,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      };
      await Promise.resolve(onSave(taskData));
    } catch (err) {
      setError('Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#fafbfc',
        borderRadius: 8,
        padding: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        maxWidth: 400,
        margin: '0 auto'
      }}
      autoComplete="off"
    >
      <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 20 }}>
        {initialTask ? 'Edit Task' : 'New Task'}
      </h2>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Title<span style={{ color: '#e74c3c' }}> *</span>
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError('');
          }}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 16
          }}
          maxLength={100}
          placeholder="Task title"
          autoFocus
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Details
        </label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ddd',
            borderRadius: 4,
            fontSize: 15,
            minHeight: 48,
            resize: 'vertical'
          }}
          maxLength={300}
          placeholder="Description, notes, etc."
        />
      </div>
      <div style={{ marginBottom: 14, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Due Date
          </label>
          <input
            type="date"
            value={dueDate || ''}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              width: '100%',
              padding: 7,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 15
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              width: '100%',
              padding: 7,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 15
            }}
          >
            {PRIORITIES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 14, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Recurrence
          </label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            style={{
              width: '100%',
              padding: 7,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 15
            }}
          >
            {RECURRENCE_OPTIONS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{
              width: '100%',
              padding: 7,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 15
            }}
            placeholder="e.g. work, urgent"
            maxLength={60}
          />
        </div>
      </div>
      {error && (
        <div style={{ color: '#e74c3c', marginBottom: 10, fontSize: 14 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '8px 18px',
            background: '#eee',
            border: 'none',
            borderRadius: 4,
            color: '#444',
            cursor: 'pointer'
          }}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: '8px 18px',
            background: '#3498db',
            border: 'none',
            borderRadius: 4,
            color: '#fff',
            fontWeight: 500,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
          disabled={saving}
        >
          {saving ? 'Saving...' : initialTask ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

TaskEditor.propTypes = {
  initialTask: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    details: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.string,
    recurrence: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default TaskEditor;