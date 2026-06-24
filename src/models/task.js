/**
 * Task data model and validation helpers.
 */

import { PRIORITIES, RECURRENCE_OPTIONS } from '../constants';

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} text
 * @property {boolean} completed
 * @property {string} [priority] - 'low' | 'medium' | 'high'
 * @property {string} [recurrence] - 'none' | 'daily' | 'weekly' | 'monthly'
 * @property {string} [dueDate] - ISO date string (e.g., '2024-06-01')
 */

/**
 * Returns a new Task object.
 * @param {Object} params
 * @param {string} params.text
 * @param {string} [params.priority]
 * @param {string} [params.recurrence]
 * @param {string} [params.dueDate]
 * @returns {Task}
 */
export function createTask({ text, priority = 'medium', recurrence = 'none', dueDate = null }) {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    priority,
    recurrence,
    dueDate
  };
}

/**
 * Validates a Task object.
 * @param {Task} task
 * @returns {string|null} Error message or null if valid
 */
export function validateTask(task) {
  if (!task || typeof task !== 'object') return 'Task must be an object.';
  if (!task.text || typeof task.text !== 'string' || !task.text.trim()) return 'Task text is required.';
  if (typeof task.completed !== 'boolean') return 'Task completed must be a boolean.';
  if (task.priority && !PRIORITIES.some((p) => p.key === task.priority)) return 'Invalid priority value.';
  if (task.recurrence && !RECURRENCE_OPTIONS.some((r) => r.key === task.recurrence)) return 'Invalid recurrence value.';
  if (task.dueDate && isNaN(Date.parse(task.dueDate))) return 'Invalid due date.';
  return null;
}