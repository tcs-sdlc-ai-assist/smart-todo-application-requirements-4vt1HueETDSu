/****
 * Accessibility utilities (focus management, ARIA helpers).
 */

/**
 * Move focus to the first focusable element inside a container.
 * @param {HTMLElement} container
 */
export function focusFirstDescendant(container) {
  if (!container) return;
  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  for (let i = 0; i < focusable.length; i++) {
    const el = focusable[i];
    if (!el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')) {
      el.focus();
      return;
    }
  }
}

/**
 * Trap focus within a container (e.g., modal dialog).
 * Returns a cleanup function to remove the trap.
 * @param {HTMLElement} container
 * @returns {Function} cleanup
 */
export function trapFocus(container) {
  if (!container) return () => {};
  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        !el.getAttribute('aria-hidden') &&
        el.offsetParent !== null
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
  container.addEventListener('keydown', handleKeyDown);
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Set aria-hidden="true" on all siblings of the given element.
 * Returns a cleanup function to restore previous aria-hidden values.
 * @param {HTMLElement} element
 * @returns {Function} cleanup
 */
export function hideOthers(element) {
  if (!element || !element.parentNode) return () => {};
  const siblings = Array.from(element.parentNode.children).filter((el) => el !== element);
  const prev = new Map();
  siblings.forEach((el) => {
    prev.set(el, el.getAttribute('aria-hidden'));
    el.setAttribute('aria-hidden', 'true');
  });
  return () => {
    siblings.forEach((el) => {
      const val = prev.get(el);
      if (val === null) {
        el.removeAttribute('aria-hidden');
      } else {
        el.setAttribute('aria-hidden', val);
      }
    });
  };
}

/**
 * Set focus to an element by id.
 * @param {string} id
 */
export function focusById(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.focus();
}