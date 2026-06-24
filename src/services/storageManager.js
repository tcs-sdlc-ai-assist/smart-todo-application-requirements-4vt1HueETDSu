/****
 * LocalStorage data access layer with versioning and error handling.
 */

const STORAGE_KEY = 'smart-todo-app-tasks';
const STORAGE_VERSION_KEY = 'smart-todo-app-storage-version';
const CURRENT_VERSION = 1;

/**
 * Save tasks to localStorage.
 * @param {Array} tasks
 * @returns {boolean} success
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
    return true;
  } catch (err) {
    // Could be quota exceeded, etc.
    return false;
  }
}

/**
 * Load tasks from localStorage.
 * @returns {Array|null} tasks or null if error
 */
export function loadTasks() {
  try {
    const version = Number(localStorage.getItem(STORAGE_VERSION_KEY));
    if (version !== CURRENT_VERSION) {
      // Version mismatch: ignore old data
      removeTasks();
      return [];
    }
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const tasks = JSON.parse(data);
    if (!Array.isArray(tasks)) return [];
    return tasks;
  } catch (err) {
    return null;
  }
}

/**
 * Remove all tasks from localStorage.
 */
export function removeTasks() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
  } catch (err) {
    // Ignore errors
  }
}

/**
 * Migrate storage if needed (for future upgrades).
 * @returns {boolean} true if migration occurred, false otherwise
 */
export function migrateStorage() {
  try {
    const version = Number(localStorage.getItem(STORAGE_VERSION_KEY));
    if (!version || version === CURRENT_VERSION) return false;
    // Example: In future, handle migration logic here
    // For now, just clear old data
    removeTasks();
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_VERSION));
    return true;
  } catch (err) {
    return false;
  }
}