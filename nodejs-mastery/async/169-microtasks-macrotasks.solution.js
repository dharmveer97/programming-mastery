import { describe, it, expect } from 'vitest';

/**
 * Exercise 169: Microtasks vs Macrotasks - SOLUTION
 */

// Demonstrate microtask vs macrotask order
export function demonstrateTaskOrder() {
  const order = [];

  // Synchronous
  console.log('Sync');
  order.push('sync');

  // Macrotask
  setTimeout(() => {
    console.log('Timeout (macrotask)');
    order.push('timeout');
  }, 0);

  // Microtasks
  Promise.resolve().then(() => {
    console.log('Promise (microtask)');
    order.push('promise');
  });

  process.nextTick(() => {
    console.log('NextTick (microtask - highest priority)');
    order.push('nextTick');
  });

  queueMicrotask(() => {
    console.log('QueueMicrotask');
    order.push('queueMicrotask');
  });

  return order;
}

// Show microtask queue draining
export function demonstrateMicrotaskDrain(callback) {
  const events = [];

  // Schedule macrotask
  setTimeout(() => events.push('timeout-1'), 0);

  // Schedule multiple microtasks
  Promise.resolve()
    .then(() => {
      events.push('promise-1');
      return Promise.resolve();
    })
    .then(() => {
      events.push('promise-2');
    });

  Promise.resolve().then(() => events.push('promise-3'));
  Promise.resolve().then(() => events.push('promise-4'));

  // Another macrotask
  setTimeout(() => {
    events.push('timeout-2');
    callback(events);
  }, 10);
}

// Demonstrate microtask starvation (controlled example)
export function demonstrateMicrotaskStarvation(callback) {
  let count = 0;
  let timeoutExecuted = false;

  function recursiveMicrotask() {
    count++;
    if (count < 1000) {
      // Keep adding microtasks
      Promise.resolve().then(recursiveMicrotask);
    } else {
      // After 1000 iterations, let it finish
      setTimeout(() => {
        callback({ count, timeoutExecuted });
      }, 10);
    }
  }

  // This will execute much later
  setTimeout(() => {
    timeoutExecuted = true;
  }, 0);

  recursiveMicrotask();
}

// Compare Promise vs setTimeout
export function comparePromiseVsTimeout(callback) {
  const order = [];

  setTimeout(() => {
    order.push('timeout-1');
    // Microtask inside macrotask runs immediately after
    Promise.resolve().then(() => {
      order.push('promise-in-timeout');
    });
  }, 0);

  Promise.resolve().then(() => {
    order.push('promise-1');
    // Macrotask inside microtask goes to macrotask queue
    setTimeout(() => {
      order.push('timeout-in-promise');
    }, 0);
  });

  setTimeout(() => {
    callback(order);
  }, 20);
}

// Demonstrate queueMicrotask
export function demonstrateQueueMicrotask(callback) {
  const order = [];

  queueMicrotask(() => {
    order.push('queueMicrotask-1');
  });

  Promise.resolve().then(() => {
    order.push('promise-1');
  });

  process.nextTick(() => {
    order.push('nextTick-1');
  });

  queueMicrotask(() => {
    order.push('queueMicrotask-2');
  });

  setTimeout(() => {
    callback(order);
  }, 10);
}

// Nested microtasks
export function demonstrateNestedMicrotasks(callback) {
  const order = [];

  Promise.resolve().then(() => {
    order.push('promise-1');
    // Nested microtask
    Promise.resolve().then(() => {
      order.push('promise-nested-1');
      // Double nested!
      Promise.resolve().then(() => {
        order.push('promise-nested-2');
      });
    });
  });

  Promise.resolve().then(() => {
    order.push('promise-2');
  });

  setTimeout(() => {
    order.push('timeout');
    callback(order);
  }, 10);
}

// Practical example: batch updates
export function batchUpdates(updates, callback) {
  let pendingUpdate = false;
  const batched = [];

  function processUpdates() {
    if (batched.length === 0) return;

    console.log('Processing batch:', batched);
    callback(batched.slice()); // Copy array
    batched.length = 0; // Clear
    pendingUpdate = false;
  }

  return function addUpdate(update) {
    batched.push(update);

    if (!pendingUpdate) {
      pendingUpdate = true;
      // Use microtask to batch all updates in this tick
      queueMicrotask(processUpdates);
    }
  };
}

// Tests
describe('Exercise 169: Microtasks vs Macrotasks - Solution', () => {
  it('should demonstrate task order', (done) => {
    const order = [];

    setTimeout(() => order.push('timeout'), 0);
    Promise.resolve().then(() => order.push('promise'));
    process.nextTick(() => order.push('nextTick'));

    setTimeout(() => {
      expect(order).toEqual(['nextTick', 'promise', 'timeout']);
      done();
    }, 10);
  });

  it('should drain all microtasks before macrotask', (done) => {
    const order = [];

    setTimeout(() => order.push('timeout-1'), 0);

    Promise.resolve()
      .then(() => {
        order.push('promise-1');
        return Promise.resolve();
      })
      .then(() => {
        order.push('promise-2');
      });

    Promise.resolve().then(() => order.push('promise-3'));

    setTimeout(() => order.push('timeout-2'), 0);

    setTimeout(() => {
      // All promises before any timeout
      const timeoutIndex = order.indexOf('timeout-1');
      expect(order.indexOf('promise-1')).toBeLessThan(timeoutIndex);
      expect(order.indexOf('promise-2')).toBeLessThan(timeoutIndex);
      expect(order.indexOf('promise-3')).toBeLessThan(timeoutIndex);
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
      // promise-1 runs first (microtask)
      expect(order[0]).toBe('promise-1');
      // timeout-1 runs next (first macrotask)
      expect(order[1]).toBe('timeout-1');
      // promise-in-timeout runs immediately after timeout-1
      expect(order[2]).toBe('promise-in-timeout');
      // timeout-in-promise runs last
      expect(order[3]).toBe('timeout-in-promise');
      done();
    }, 20);
  });

  it('should demonstrate queueMicrotask', (done) => {
    const order = [];

    queueMicrotask(() => order.push('queueMicrotask'));
    Promise.resolve().then(() => order.push('promise'));
    process.nextTick(() => order.push('nextTick'));

    setTimeout(() => {
      // nextTick is always first
      expect(order[0]).toBe('nextTick');
      // queueMicrotask and promise order may vary
      expect(order).toContain('queueMicrotask');
      expect(order).toContain('promise');
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
      // All promises (including nested) before timeout
      expect(order.indexOf('promise-1')).toBeLessThan(order.indexOf('timeout'));
      expect(order.indexOf('promise-2')).toBeLessThan(order.indexOf('timeout'));
      expect(order.indexOf('promise-nested')).toBeLessThan(order.indexOf('timeout'));
      done();
    }, 10);
  });

  it('should batch updates efficiently', (done) => {
    const batches = [];

    const addUpdate = batchUpdates([], (batch) => {
      batches.push(batch);
    });

    // Add multiple updates synchronously
    addUpdate('a');
    addUpdate('b');
    addUpdate('c');

    setTimeout(() => {
      addUpdate('d');
      addUpdate('e');
    }, 5);

    setTimeout(() => {
      // Should have 2 batches
      expect(batches).toHaveLength(2);
      expect(batches[0]).toEqual(['a', 'b', 'c']);
      expect(batches[1]).toEqual(['d', 'e']);
      done();
    }, 20);
  });

  it('should demonstrate microtask starvation', (done) => {
    let microCount = 0;
    let macroExecuted = false;

    function addMicrotasks(count) {
      if (microCount >= count) return;

      Promise.resolve().then(() => {
        microCount++;
        addMicrotasks(count);
      });
    }

    setTimeout(() => {
      macroExecuted = true;
    }, 0);

    addMicrotasks(100);

    setTimeout(() => {
      // After 100 microtasks complete, macro can run
      expect(microCount).toBe(100);
      expect(macroExecuted).toBe(true);
      done();
    }, 50);
  }, 10000);

  it('should understand execution order with multiple types', (done) => {
    const order = [];

    // Mix everything
    setTimeout(() => order.push('timeout'), 0);
    setImmediate(() => order.push('immediate'));
    process.nextTick(() => order.push('nextTick'));
    Promise.resolve().then(() => order.push('promise'));
    queueMicrotask(() => order.push('queueMicrotask'));

    setTimeout(() => {
      // nextTick first
      expect(order[0]).toBe('nextTick');
      // Microtasks (promise, queueMicrotask) before macrotasks
      const timeoutIndex = order.indexOf('timeout');
      expect(order.indexOf('promise')).toBeLessThan(timeoutIndex);
      expect(order.indexOf('queueMicrotask')).toBeLessThan(timeoutIndex);
      done();
    }, 20);
  });

  it('should show microtask priority in practice', (done) => {
    const order = [];

    // Start a timer
    setTimeout(() => {
      order.push('timeout-start');

      // Schedule microtask from within macrotask
      Promise.resolve().then(() => {
        order.push('promise-in-timeout');
      });

      // Schedule another macrotask
      setTimeout(() => {
        order.push('timeout-nested');
      }, 0);
    }, 0);

    setTimeout(() => {
      // promise-in-timeout runs before timeout-nested
      expect(order).toEqual([
        'timeout-start',
        'promise-in-timeout',
        'timeout-nested'
      ]);
      done();
    }, 20);
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Task Queue Types:
 *    Microtasks: process.nextTick, Promises, queueMicrotask
 *    Macrotasks: setTimeout, setInterval, setImmediate, I/O
 *
 * 2. Execution Order:
 *    - All microtasks drain before next macrotask
 *    - ONE macrotask, then back to microtasks
 *    - process.nextTick has highest priority
 *
 * 3. Priority Within Microtasks:
 *    1. process.nextTick() queue
 *    2. Promise/queueMicrotask (order may vary)
 *
 * 4. Nested Tasks:
 *    - Microtask scheduling microtask: runs in same drain
 *    - Macrotask scheduling microtask: runs after that macrotask
 *    - Microtask scheduling macrotask: goes to macrotask queue
 *
 * 5. Practical Applications:
 *    - Batch updates: use queueMicrotask
 *    - High priority work: use microtasks
 *    - Yield to I/O: use macrotasks
 *    - State synchronization: use promises
 *
 * 6. Common Pitfalls:
 *    - Infinite microtasks starve I/O
 *    - Too many microtasks block rendering
 *    - Order between Promise and queueMicrotask not guaranteed
 *    - nextTick can delay everything
 *
 * 7. Debugging Tips:
 *    - Log with task type
 *    - Check for microtask loops
 *    - Monitor event loop lag
 *    - Use async hooks for tracking
 *
 * 8. Best Practices:
 *    - Limit microtask chains
 *    - Use macrotasks to yield
 *    - Batch with queueMicrotask
 *    - Avoid recursive nextTick
 *    - Understand priority for debugging
 */
