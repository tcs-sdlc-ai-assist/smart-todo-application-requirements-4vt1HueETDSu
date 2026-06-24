/****
 * Task service layer: business logic for CRUD, search, filter, recurrence, and reminders.
 */

import { createTask, validateTask } from '../models/task';
import { saveTasks, loadTasks } from './storageManager';

/**
 * Get all tasks from storage.
 * @returns {Array}
 */
export function getAllTasks() {
  const tasks = loadTasks();
  return Array.isArray(tasks) ? tasks : [];
}

/**
 * Add a new task.
 * @param {Object} params - Task creation params
 * @returns {{task: Object|null, error: string|null}}
 */
export function addTask(params) {
  const task = createTask(params);
  const error = validateTask(task);
  if (error) return { task: null, error };
  const tasks = getAllTasks();
  tasks.push(task);
  const success = saveTasks(tasks);
  if (!success) return { task: null, error: 'Failed to save task.' };
  return { task, error: null };
}

/**
 * Update an existing task by id.
 * @param {number} id
 * @param {Object} updates
 * @returns {{task: Object|null, error: string|null}}
 */
export function updateTask(id, updates) {
  const tasks = getAllTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return { task: null, error: 'Task not found.' };
  const updated = { ...tasks[idx], ...updates };
  const error = validateTask(updated);
  if (error) return { task: null, error };
  tasks[idx] = updated;
  const success = saveTasks(tasks);
  if (!success) return { task: null, error: 'Failed to save task.' };
  return { task: updated, error: null };
}

/**
 * Delete a task by id.
 * @param {number} id
 * @returns {boolean} success
 */
export function deleteTask(id) {
  const tasks = getAllTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  const success = saveTasks(filtered);
  return success;
}

/**
 * Toggle completed status of a task.
 * @param {number} id
 * @returns {{task: Object|null, error: string|null}}
 */
export function toggleTaskCompleted(id) {
  const tasks = getAllTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return { task: null, error: 'Task not found.' };
  const updated = { ...tasks[idx], completed: !tasks[idx].completed };
  const error = validateTask(updated);
  if (error) return { task: null, error };
  tasks[idx] = updated;
  const success = saveTasks(tasks);
  if (!success) return { task: null, error: 'Failed to save task.' };
  return { task: updated, error: null };
}

/**
 * Search tasks by text (case-insensitive).
 * @param {string} query
 * @returns {Array}
 */
export function searchTasks(query) {
  const tasks = getAllTasks();
  if (!query || typeof query !== 'string') return tasks;
  const q = query.trim().toLowerCase();
  return tasks.filter((t) => t.text.toLowerCase().includes(q));
}

/**
 * Filter tasks by completion status.
 * @param {'all'|'active'|'completed'} filter
 * @returns {Array}
 */
export function filterTasksByStatus(filter) {
  const tasks = getAllTasks();
  if (filter === 'active') return tasks.filter((t) => !t.completed);
  if (filter === 'completed') return tasks.filter((t) => t.completed);
  return tasks;
}

/**
 * Filter tasks by priority.
 * @param {'low'|'medium'|'high'} priority
 * @returns {Array}
 */
export function filterTasksByPriority(priority) {
  const tasks = getAllTasks();
  if (!priority) return tasks;
  return tasks.filter((t) => t.priority === priority);
}

/**
 * Get tasks with recurrence enabled.
 * @returns {Array}
 */
export function getRecurringTasks() {
  const tasks = getAllTasks();
  return tasks.filter((t) => t.recurrence && t.recurrence !== 'none');
}

/**
 * Get tasks due today.
 * @returns {Array}
 */
export function getTasksDueToday() {
  const tasks = getAllTasks();
  const today = new Date();
  return tasks.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  });
}

/**
 * Schedule next occurrence for a recurring task.
 * (This does NOT persist the update; call updateTask with the result.)
 * @param {Object} task
 * @returns {Object} updated task with new dueDate
 */
export function getNextRecurrence(task) {
  if (!task.recurrence || !task.dueDate) return task;
  const due = new Date(task.dueDate);
  let nextDue = new Date(due);
  switch (task.recurrence) {
    case 'daily':
      nextDue.setDate(due.getDate() + 1);
      break;
    case 'weekly':
      nextDue.setDate(due.getDate() + 7);
      break;
    case 'monthly':
      nextDue.setMonth(due.getMonth() + 1);
      break;
    default:
      return task;
  }
  return { ...task, dueDate: nextDue.toISOString().slice(0, 10), completed: false };
}

/**
 * Get tasks with reminders (dueDate in the future and not completed).
 * @returns {Array}
 */
export function getUpcomingReminders() {
  const tasks = getAllTasks();
  const now = new Date();
  return tasks.filter(
    (t) =>
      t.dueDate &&
      !t.completed &&
      new Date(t.dueDate) > now
  );
}