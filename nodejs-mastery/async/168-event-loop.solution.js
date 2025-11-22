import { describe, it, expect } from 'vitest';
import fs from 'fs';

/**
 * Exercise 168: Understanding the Event Loop - SOLUTION
 */

// Demonstrate execution order across all phases
export function demonstrateEventLoop() {
  const order = [];

  // 1. Synchronous
  console.log('1. Synchronous start');
  order.push('sync-start');

  // 2. process.nextTick - highest priority
  process.nextTick(() => {
    console.log('2. nextTick');
    order.push('nextTick');
  });

  // 3. Promise microtasks - after nextTick
  Promise.resolve().then(() => {
    console.log('3. Promise microtask');
    order.push('promise');
  });

  // 4. Timers phase
  setTimeout(() => {
    console.log('4. setTimeout');
    order.push('setTimeout');
  }, 0);

  // 5. Check phase
  setImmediate(() => {
    console.log('5. setImmediate');
    order.push('setImmediate');
  });

  // 6. Synchronous end
  console.log('1.5 Synchronous end');
  order.push('sync-end');

  return order;
}

// Understand timer phase behavior
export function understandTimers(callback) {
  const events = [];

  // setTimeout(0) is not truly 0ms
  // Minimum is ~1ms (system dependent)
  const start = Date.now();

  setTimeout(() => {
    const elapsed = Date.now() - start;
    events.push({ type: 'setTimeout', elapsed });
  }, 0);

  setImmediate(() => {
    events.push({ type: 'setImmediate' });
  });

  setTimeout(() => {
    callback(events);
  }, 50);
}

// Demonstrate poll phase
export function demonstratePollPhase(callback) {
  const events = [];

  // I/O operation enters poll phase
  fs.readFile(__filename, 'utf8', (err, data) => {
    events.push('file-read-callback');

    // In I/O callback context
    setTimeout(() => {
      events.push('setTimeout-in-io');
    }, 0);

    setImmediate(() => {
      events.push('setImmediate-in-io');
      callback(events);
    });
  });
}

// Understand check phase (setImmediate)
export function demonstrateCheckPhase(callback) {
  const order = [];

  // Outside I/O: order is non-deterministic
  setTimeout(() => order.push('timeout-main'), 0);
  setImmediate(() => order.push('immediate-main'));

  // Inside I/O: setImmediate always before setTimeout
  fs.readFile(__filename, () => {
    setTimeout(() => order.push('timeout-io'), 0);
    setImmediate(() => {
      order.push('immediate-io');
      callback(order);
    });
  });
}

// Demonstrate close callbacks
export function demonstrateCloseCallbacks(callback) {
  const events = [];
  const { Readable } = require('stream');

  const stream = new Readable({
    read() {
      this.push('data');
      this.push(null); // End stream
    }
  });

  stream.on('data', () => {
    events.push('data');
  });

  stream.on('end', () => {
    events.push('end');
  });

  stream.on('close', () => {
    events.push('close');
    callback(events);
  });

  stream.destroy();
}

// Show starvation with process.nextTick
export function demonstrateStarvation(callback) {
  let tickCount = 0;
  let immediateExecuted = false;

  function recursiveNextTick() {
    tickCount++;
    if (tickCount < 1000) {
      // This will keep running before setImmediate gets a chance
      process.nextTick(recursiveNextTick);
    } else {
      callback({ tickCount, immediateExecuted });
    }
  }

  recursiveNextTick();

  setImmediate(() => {
    immediateExecuted = true;
  });
}

// Compare execution in different contexts
export function compareContexts(callback) {
  const results = {
    mainContext: [],
    ioContext: []
  };

  // Main context: order is non-deterministic
  setTimeout(() => results.mainContext.push('timeout'), 0);
  setImmediate(() => results.mainContext.push('immediate'));

  // I/O context: setImmediate always first
  fs.readFile(__filename, () => {
    setTimeout(() => results.ioContext.push('timeout'), 0);
    setImmediate(() => {
      results.ioContext.push('immediate');
      callback(results);
    });
  });
}

// Tests
describe('Exercise 168: Event Loop - Solution', () => {
  it('should demonstrate execution order', (done) => {
    const order = [];

    console.log('Start');
    order.push('start');

    setTimeout(() => {
      order.push('setTimeout');
      expect(order.indexOf('nextTick')).toBeLessThan(order.indexOf('setTimeout'));
    }, 0);

    setImmediate(() => {
      order.push('setImmediate');
    });

    process.nextTick(() => {
      order.push('nextTick');
      expect(order).toContain('start');
      expect(order).toContain('end');
    });

    Promise.resolve().then(() => {
      order.push('promise');
      expect(order.indexOf('nextTick')).toBeLessThan(order.indexOf('promise'));
    });

    console.log('End');
    order.push('end');

    setTimeout(() => {
      expect(order).toContain('start');
      expect(order).toContain('end');
      expect(order).toContain('nextTick');
      expect(order).toContain('promise');
      expect(order).toContain('setTimeout');
      expect(order).toContain('setImmediate');
      done();
    }, 50);
  });

  it('should understand timer precision', (done) => {
    const start = Date.now();

    setTimeout(() => {
      const elapsed = Date.now() - start;
      // setTimeout(0) is not exactly 0ms
      expect(elapsed).toBeGreaterThanOrEqual(0);
      // Usually 1-5ms on most systems
      expect(elapsed).toBeLessThan(20);
      done();
    }, 0);
  });

  it('should understand setImmediate in I/O context', (done) => {
    const order = [];

    fs.readFile(__filename, () => {
      setTimeout(() => {
        order.push('setTimeout');
      }, 0);

      setImmediate(() => {
        order.push('setImmediate');
      });

      setImmediate(() => {
        // In I/O context, setImmediate runs before setTimeout
        expect(order[0]).toBe('setImmediate');
        expect(order[1]).toBe('setTimeout');
        done();
      });
    });
  });

  it('should process nextTick before promises', (done) => {
    const order = [];

    Promise.resolve().then(() => {
      order.push('promise');
    });

    process.nextTick(() => {
      order.push('nextTick');
    });

    setTimeout(() => {
      expect(order[0]).toBe('nextTick');
      expect(order[1]).toBe('promise');
      done();
    }, 10);
  });

  it('should demonstrate nextTick recursion', (done) => {
    let count = 0;
    let immediateRan = false;

    function recurse() {
      count++;
      if (count < 100) {
        process.nextTick(recurse);
      } else {
        // After all nextTicks, check if immediate ran
        setTimeout(() => {
          expect(count).toBe(100);
          expect(immediateRan).toBe(true);
          done();
        }, 10);
      }
    }

    recurse();

    setImmediate(() => {
      immediateRan = true;
      // This runs after all nextTick callbacks
      expect(count).toBe(100);
    });
  });

  it('should understand phase transitions', (done) => {
    const events = [];

    setTimeout(() => events.push('timer'), 0);
    setImmediate(() => events.push('check'));
    process.nextTick(() => events.push('nextTick'));
    Promise.resolve().then(() => events.push('microtask'));

    setTimeout(() => {
      expect(events).toContain('nextTick');
      expect(events).toContain('microtask');
      expect(events).toContain('timer');
      expect(events).toContain('check');

      // nextTick before microtask
      expect(events.indexOf('nextTick')).toBeLessThan(events.indexOf('microtask'));
      done();
    }, 50);
  });

  it('should demonstrate multiple nextTick callbacks', (done) => {
    const order = [];

    process.nextTick(() => {
      order.push('nextTick-1');
      process.nextTick(() => order.push('nextTick-nested'));
    });

    process.nextTick(() => order.push('nextTick-2'));

    Promise.resolve().then(() => order.push('promise'));

    setTimeout(() => {
      // All nextTicks process before promises
      expect(order).toEqual([
        'nextTick-1',
        'nextTick-2',
        'nextTick-nested',
        'promise'
      ]);
      done();
    }, 10);
  });

  it('should show I/O vs main context difference', (done) => {
    const mainOrder = [];
    const ioOrder = [];

    // Main context - order can vary
    setTimeout(() => mainOrder.push('timeout'), 0);
    setImmediate(() => mainOrder.push('immediate'));

    // I/O context - setImmediate always first
    fs.readFile(__filename, () => {
      setTimeout(() => ioOrder.push('timeout'), 0);
      setImmediate(() => {
        ioOrder.push('immediate');

        setTimeout(() => {
          // I/O context: setImmediate before setTimeout
          expect(ioOrder[0]).toBe('immediate');
          expect(ioOrder[1]).toBe('timeout');
          done();
        }, 10);
      });
    });
  });

  it('should demonstrate long computation blocking', (done) => {
    const events = [];
    const start = Date.now();

    // Schedule immediate callback
    setImmediate(() => {
      const elapsed = Date.now() - start;
      events.push({ type: 'immediate', elapsed });
    });

    // Block event loop with computation
    const computeEnd = Date.now() + 100;
    while (Date.now() < computeEnd) {
      // Blocking!
    }

    setTimeout(() => {
      expect(events[0].elapsed).toBeGreaterThanOrEqual(100);
      done();
    }, 50);
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Event Loop Phases:
 *    Timers -> Poll -> Check -> Close
 *    Between phases: nextTick, then microtasks
 *
 * 2. Execution Order:
 *    1. Synchronous code
 *    2. process.nextTick()
 *    3. Promise microtasks
 *    4. setTimeout/setInterval (timers)
 *    5. setImmediate (check)
 *    6. I/O callbacks (poll)
 *    7. Close callbacks
 *
 * 3. Context Matters:
 *    - Main: setTimeout vs setImmediate is non-deterministic
 *    - I/O: setImmediate always before setTimeout(0)
 *
 * 4. process.nextTick:
 *    - Executes before any phase
 *    - Can starve I/O if overused
 *    - Use for error-first callbacks
 *    - Avoid recursive nextTick
 *
 * 5. setImmediate:
 *    - Better than setTimeout(fn, 0)
 *    - Executes in check phase
 *    - Guaranteed to run after I/O
 *    - Use for breaking up long operations
 *
 * 6. Blocking Operations:
 *    - Long computations block event loop
 *    - Nothing else can run
 *    - Use setImmediate to yield control
 *    - Consider worker threads for CPU-intensive work
 *
 * 7. Best Practices:
 *    - Prefer setImmediate over setTimeout(fn, 0)
 *    - Use nextTick sparingly
 *    - Break up long computations
 *    - Understand phase behavior
 *    - Don't block the event loop
 */
