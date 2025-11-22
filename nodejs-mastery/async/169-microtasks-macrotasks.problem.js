import { describe, it, expect } from 'vitest';

/**
 * Exercise 169: Microtasks vs Macrotasks
 *
 * JavaScript has two types of async task queues:
 *
 * MICROTASKS (higher priority):
 * - process.nextTick() (highest priority)
 * - Promise callbacks (.then, .catch, .finally)
 * - queueMicrotask()
 * - MutationObserver (browser)
 *
 * MACROTASKS (lower priority):
 * - setTimeout
 * - setInterval
 * - setImmediate
 * - I/O operations
 * - UI rendering (browser)
 *
 * EXECUTION ORDER:
 * 1. Execute all synchronous code
 * 2. Execute ALL microtasks (until queue is empty)
 * 3. Execute ONE macrotask
 * 4. Back to step 2 (check microtasks again)
 * 5. Repeat
 *
 * KEY DIFFERENCE:
 * - Microtasks: ALL tasks run before next macrotask
 * - Macrotasks: ONE task runs, then check microtasks
 *
 * IMPLICATIONS:
 * - Microtasks can starve macrotasks
 * - Promises run before timers
 * - nextTick runs before promises
 *
 * Task: Master microtask vs macrotask behavior
 */

// TODO: Demonstrate microtask vs macrotask order
export function demonstrateTaskOrder() {
  const order = [];

  // Your code here
  // Add:
  // - Synchronous code
  // - setTimeout (macrotask)
  // - Promise (microtask)
  // - process.nextTick (microtask, highest priority)
  // - queueMicrotask
  // Track execution order

  return order;
}

// TODO: Show microtask queue draining
export function demonstrateMicrotaskDrain() {
  const events = [];

  // Your code here
  // Show that ALL microtasks run
  // before the next macrotask

  // Add multiple promises
  // Add setTimeout
  // Show promises all run first
}

// TODO: Demonstrate microtask starvation
export function demonstrateMicrotaskStarvation() {
  // Your code here
  // Create infinite microtasks
  // Show that macrotasks never run
  // (Don't actually create infinite loop in test!)
}

// TODO: Compare Promise vs setTimeout
export function comparePromiseVsTimeout() {
  const order = [];

  // Your code here
  // Mix promises and setTimeout
  // Show execution order

  return order;
}

// TODO: Demonstrate queueMicrotask
export function demonstrateQueueMicrotask() {
  const order = [];

  // Your code here
  // Use queueMicrotask()
  // Compare with Promise.resolve().then()
  // Compare with process.nextTick()

  return order;
}

// TODO: Nested microtasks
export function demonstrateNestedMicrotasks() {
  const order = [];

  // Your code here
  // Promise that creates another promise
  // Show they all run before macrotasks

  return order;
}

// TODO: Practical example: batch updates
export function batchUpdates(updates, callback) {
  // Your code here
  // Use microtasks to batch multiple updates
  // Only process once per event loop tick
  // Example: multiple state updates -> single render
}

// Tests
describe('Exercise 169: Microtasks vs Macrotasks', () => {
  it('should demonstrate task order', (done) => {
    const order = [];

    setTimeout(() => order.push('timeout'), 0);
    Promise.resolve().then(() => order.push('promise'));
    process.nextTick(() => order.push('nextTick'));

    setTimeout(() => {
      // TODO: Add expectations
      // nextTick -> promise -> timeout
      done();
    }, 10);
  });

  it('should drain all microtasks before macrotask', (done) => {
    const order = [];

    setTimeout(() => order.push('timeout-1'), 0);

    Promise.resolve().then(() => {
      order.push('promise-1');
      return Promise.resolve();
    }).then(() => {
      order.push('promise-2');
    });

    Promise.resolve().then(() => order.push('promise-3'));

    setTimeout(() => order.push('timeout-2'), 0);

    setTimeout(() => {
      // TODO: Add expectations
      // All promises before any timeout
      done();
    }, 20);
  });

  it('should compare promise vs setTimeout', (done) => {
    const order = [];

    setTimeout(() => {
      order.push('timeout-1');
      Promise.resolve().then(() => order.push('promise-in-timeout'));
    }, 0);

    Promise.resolve().then(() => {
      order.push('promise-1');
      setTimeout(() => order.push('timeout-in-promise'), 0);
    });

    setTimeout(() => {
      // TODO: Add expectations
      done();
    }, 20);
  });

  it('should demonstrate queueMicrotask', (done) => {
    const order = [];

    queueMicrotask(() => order.push('queueMicrotask'));
    Promise.resolve().then(() => order.push('promise'));
    process.nextTick(() => order.push('nextTick'));

    setTimeout(() => {
      // TODO: Add expectations
      // nextTick -> queueMicrotask/promise (order varies)
      done();
    }, 10);
  });

  it('should handle nested microtasks', (done) => {
    const order = [];

    Promise.resolve().then(() => {
      order.push('promise-1');
      Promise.resolve().then(() => order.push('promise-nested'));
    });

    Promise.resolve().then(() => order.push('promise-2'));

    setTimeout(() => order.push('timeout'), 0);

    setTimeout(() => {
      // TODO: Add expectations
      // All promises (including nested) before timeout
      done();
    }, 10);
  });

  it('should batch updates efficiently', (done) => {
    let processCount = 0;
    const updates = [];

    function processUpdates() {
      processCount++;
      // Process all accumulated updates
    }

    function addUpdate(update) {
      updates.push(update);
      queueMicrotask(processUpdates);
    }

    // Add multiple updates
    addUpdate('a');
    addUpdate('b');
    addUpdate('c');

    setTimeout(() => {
      // TODO: Add expectations
      // Should process once per tick
      done();
    }, 10);
  });
});

/**
 * VISUALIZATION:
 *
 * Event Loop Tick:
 * ┌─────────────────────────────────┐
 * │ 1. Execute script (sync code)  │
 * └────────────┬────────────────────┘
 *              │
 * ┌────────────▼────────────────────┐
 * │ 2. Process ALL microtasks:     │
 * │    - process.nextTick queue    │
 * │    - Promise microtasks        │
 * │    - queueMicrotask queue      │
 * └────────────┬────────────────────┘
 *              │
 * ┌────────────▼────────────────────┐
 * │ 3. Execute ONE macrotask:      │
 * │    - setTimeout callback       │
 * │    - setInterval callback      │
 * │    - I/O callback              │
 * └────────────┬────────────────────┘
 *              │
 *              └──> Back to step 2
 *
 * PRIORITY ORDER:
 * 1. process.nextTick() (highest)
 * 2. Promise microtasks
 * 3. queueMicrotask()
 * 4. setTimeout/setInterval
 * 5. setImmediate
 * 6. I/O callbacks
 *
 * BEST PRACTICES:
 * - Use microtasks for high-priority work
 * - Avoid infinite microtask loops
 * - Use macrotasks to yield to I/O
 * - Batch updates with microtasks
 * - Understand priority for debugging
 *
 * COMMON PITFALLS:
 * - Too many microtasks can starve I/O
 * - Recursive microtasks can block
 * - Order between Promise and queueMicrotask is not guaranteed
 * - nextTick is Node.js only (not standard)
 */
