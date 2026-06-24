/****
 * Reminder notification handler: schedules and triggers in-browser notifications for task reminders.
 */

import { getUpcomingReminders } from './taskService';

const REMINDER_INTERVAL_MS = 60 * 1000; // Check every 1 minute
let reminderTimer = null;
let notifiedTaskIds = new Set();

/**
 * Request notification permission from the user.
 * @returns {Promise<boolean>}
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch (err) {
    return false;
  }
}

/**
 * Show a browser notification for a task.
 * @param {Object} task
 */
function showTaskNotification(task) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  const title = 'Task Reminder';
  const body = `${task.text}${task.dueDate ? ` (Due: ${task.dueDate})` : ''}`;
  try {
    new Notification(title, {
      body,
      tag: `task-${task.id}`,
      icon: '/favicon.ico'
    });
  } catch (err) {
    // Ignore notification errors
  }
}

/**
 * Check for due reminders and trigger notifications.
 */
function checkAndNotifyReminders() {
  const now = new Date();
  const reminders = getUpcomingReminders();
  reminders.forEach((task) => {
    if (notifiedTaskIds.has(task.id)) return;
    if (!task.dueDate) return;
    const due = new Date(task.dueDate);
    // Notify if due within next 10 minutes
    const diff = due.getTime() - now.getTime();
    if (diff <= 10 * 60 * 1000 && diff > 0) {
      showTaskNotification(task);
      notifiedTaskIds.add(task.id);
    }
  });
  // Clean up notifiedTaskIds for tasks that are no longer upcoming
  const validIds = new Set(reminders.map((t) => t.id));
  notifiedTaskIds.forEach((id) => {
    if (!validIds.has(id)) notifiedTaskIds.delete(id);
  });
}

/**
 * Start the reminder notification polling.
 */
export async function startReminderManager() {
  const granted = await requestNotificationPermission();
  if (!granted) return;
  if (reminderTimer) return;
  checkAndNotifyReminders();
  reminderTimer = setInterval(checkAndNotifyReminders, REMINDER_INTERVAL_MS);
}

/**
 * Stop the reminder notification polling.
 */
export function stopReminderManager() {
  if (reminderTimer) {
    clearInterval(reminderTimer);
    reminderTimer = null;
  }
  notifiedTaskIds.clear();
}