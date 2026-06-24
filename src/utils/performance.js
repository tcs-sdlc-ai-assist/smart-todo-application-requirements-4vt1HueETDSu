/****
 * Performance utilities (timing, render checks for <2s).
 */

/**
 * Measure the time taken by a synchronous function.
 * @param {Function} fn - Function to execute
 * @returns {{result: any, duration: number}} result and duration in ms
 */
export function measureSync(fn) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Measure the time taken by an async function (returns a Promise).
 * @param {Function} fn - Async function to execute
 * @returns {Promise<{result: any, duration: number}>}
 */
export async function measureAsync(fn) {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Checks if a render or operation completed within a threshold (default 2000ms).
 * @param {number} duration - Duration in ms
 * @param {number} [threshold=2000] - Threshold in ms
 * @returns {boolean}
 */
export function isFastRender(duration, threshold = 2000) {
  return duration < threshold;
}

/**
 * Debounce a function (waits for delay ms after last call).
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle a function (runs at most once per interval).
 * @param {Function} fn
 * @param {number} interval
 * @returns {Function}
 */
export function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}