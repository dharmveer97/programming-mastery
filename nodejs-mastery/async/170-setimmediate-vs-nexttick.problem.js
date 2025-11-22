import { describe, it, expect } from 'vitest';

/**
 * Exercise 170: setImmediate vs setTimeout vs process.nextTick
 *
 * Understanding the Node.js Event Loop timing functions:
 *
 * 1. process.nextTick()
 *    - Executes BEFORE the next event loop tick
 *    - Highest priority
 *    - Executes after current operation, before I/O
 *
 * 2. setImmediate()
 *    - Executes in the NEXT iteration of event loop
 *    - After I/O events
 *    - Designed for I/O callbacks
 *
 * 3. setTimeout(fn, 0)
 *    - Minimum delay, but not immediate
 *    - Scheduled in timers phase
 *    - Execution depends on system performance
 *
 * EXECUTION ORDER (generally):
 * 1. Synchronous code
 * 2. process.nextTick() callbacks
 * 3. Promise microtasks
 * 4. setTimeout/setInterval (timers phase)
 * 5. setImmediate() (check phase)
 *
 * Task: Understand the execution order
 */

// TODO: Predict and test the execution order
export function demonstrateExecutionOrder() {
  const executionOrder = [];

  // Your code here: Use all three timing functions
  // and track their execution order

  console.log('1. Synchronous');
  executionOrder.push('sync');

  process.nextTick(() => {
    console.log('2. process.nextTick');
    executionOrder.push('nextTick');
  });

  setImmediate(() => {
    console.log('4. setImmediate');
    executionOrder.push('setImmediate');
  });

  setTimeout(() => {
    console.log('3. setTimeout(0)');
    executionOrder.push('setTimeout');
  }, 0);

  Promise.resolve().then(() => {
    console.log('2.5. Promise microtask');
    executionOrder.push('promise');
  });

  return executionOrder;
}

// Tests
describe('Exercise 170: Event Loop Timing', () => {
  it('should understand process.nextTick priority', (done) => {
    const order = [];

    console.log('Start');
    order.push('start');

    process.nextTick(() => {
      order.push('nextTick');
    });

    setTimeout(() => {
      order.push('setTimeout');

      // nextTick should execute before setTimeout
      expect(order).toContain('nextTick');
      expect(order.indexOf('nextTick')).toBeLessThan(order.indexOf('setTimeout'));
      done();
    }, 0);
  });

  it('should understand setImmediate vs setTimeout', (done) => {
    const order = [];

    setImmediate(() => {
      order.push('setImmediate');
    });

    setTimeout(() => {
      order.push('setTimeout');

      // Order can vary, but both should execute
      expect(order.length).toBe(2);
      done();
    }, 0);
  });
});

/**
 * PRACTICAL EXAMPLES:
 *
 * Use process.nextTick() when:
 * - You need to execute before I/O
 * - Handling errors before returning
 * - Cleaning up resources
 *
 * Use setImmediate() when:
 * - You want to execute after I/O
 * - Breaking up long computations
 * - Giving I/O operations a chance
 *
 * Use setTimeout() when:
 * - You need actual delay
 * - Scheduling future tasks
 *
 * WARNING:
 * - Too many process.nextTick() can starve I/O
 * - setImmediate is better for most async operations
 */
