import { describe, it, expect } from 'vitest';

/**
 * Exercise 170: setImmediate vs setTimeout vs process.nextTick - SOLUTION
 */

export function demonstrateExecutionOrder() {
  const executionOrder = [];

  console.log('1. Synchronous');
  executionOrder.push('sync');

  // Executes FIRST (before event loop)
  process.nextTick(() => {
    console.log('2. process.nextTick');
    executionOrder.push('nextTick');
  });

  // Executes LAST (next event loop iteration)
  setImmediate(() => {
    console.log('4. setImmediate');
    executionOrder.push('setImmediate');
  });

  // Executes in timers phase
  setTimeout(() => {
    console.log('3. setTimeout(0)');
    executionOrder.push('setTimeout');
  }, 0);

  // Microtask - executes after nextTick, before setTimeout
  Promise.resolve().then(() => {
    console.log('2.5. Promise microtask');
    executionOrder.push('promise');
  });

  return executionOrder;
}

// Real-world example: Error handling with nextTick
export function readFileAsync(filename, callback) {
  // Validate input
  if (!filename) {
    // Use nextTick to ensure callback is always async
    process.nextTick(() => {
      callback(new Error('Filename required'));
    });
    return;
  }

  // Simulate async file read
  setTimeout(() => {
    callback(null, 'file contents');
  }, 100);
}

// Real-world example: Breaking up long computation
export function processLargeArray(items, callback) {
  const results = [];
  let index = 0;

  function processNext() {
    // Process items in chunks
    const chunk = items.slice(index, index + 1000);

    chunk.forEach(item => {
      results.push(item * 2);
    });

    index += 1000;

    if (index < items.length) {
      // Use setImmediate to give I/O a chance
      setImmediate(processNext);
    } else {
      callback(results);
    }
  }

  processNext();
}

// Tests
describe('Exercise 170: Event Loop Timing - Solution', () => {
  it('should understand process.nextTick priority', (done) => {
    const order = [];

    console.log('Start');
    order.push('start');

    process.nextTick(() => {
      order.push('nextTick');
    });

    setTimeout(() => {
      order.push('setTimeout');

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
      expect(order.length).toBe(2);
      done();
    }, 0);
  });

  it('should handle errors with nextTick', (done) => {
    readFileAsync('', (err, data) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Filename required');
      done();
    });
  });
});

/**
 * EVENT LOOP PHASES:
 *
 * 1. Timers: Execute setTimeout/setInterval callbacks
 * 2. Pending Callbacks: I/O callbacks deferred to next iteration
 * 3. Idle, Prepare: Internal use only
 * 4. Poll: Retrieve new I/O events
 * 5. Check: Execute setImmediate callbacks
 * 6. Close Callbacks: socket.on('close', ...)
 *
 * Between each phase:
 * - process.nextTick() queue is processed
 * - Promise microtasks are processed
 *
 * BEST PRACTICES:
 * - Prefer setImmediate over setTimeout(fn, 0)
 * - Use nextTick sparingly (can block I/O)
 * - For recursive operations, use setImmediate
 * - For error-first callbacks, use nextTick
 */
