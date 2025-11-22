import { describe, it, expect } from 'vitest';

/**
 * Exercise 168: Understanding the Event Loop
 *
 * The Event Loop is the heart of Node.js asynchronous architecture.
 *
 * EVENT LOOP PHASES (in order):
 * 1. Timers - Execute setTimeout/setInterval callbacks
 * 2. Pending Callbacks - I/O callbacks deferred to next loop
 * 3. Idle, Prepare - Internal use only
 * 4. Poll - Retrieve new I/O events, execute I/O callbacks
 * 5. Check - Execute setImmediate() callbacks
 * 6. Close Callbacks - Execute close event callbacks (e.g., socket.on('close'))
 *
 * BETWEEN EACH PHASE:
 * - process.nextTick() queue is processed
 * - Promise microtasks are processed
 *
 * EXECUTION ORDER:
 * 1. Synchronous code
 * 2. process.nextTick() callbacks
 * 3. Promise microtasks
 * 4. Timer callbacks (setTimeout, setInterval)
 * 5. setImmediate() callbacks
 * 6. I/O callbacks
 * 7. Close callbacks
 *
 * KEY CONCEPTS:
 * - Event loop is single-threaded
 * - I/O operations are delegated to worker threads
 * - Callbacks execute on the main thread
 * - Understanding phases helps debug timing issues
 *
 * Task: Understand and predict event loop behavior
 */

// TODO: Demonstrate execution order across all phases
export function demonstrateEventLoop() {
  const order = [];

  // Your code here
  // Add callbacks to different phases:
  // - Synchronous
  // - process.nextTick()
  // - Promise microtasks
  // - setTimeout
  // - setImmediate
  // Track execution order

  return order;
}

// TODO: Understand timer phase behavior
export function understandTimers(callback) {
  // Your code here
  // Demonstrate setTimeout(0) behavior
  // Show that 0ms doesn't mean immediate
  // Compare with setImmediate
}

// TODO: Demonstrate poll phase
export function demonstratePollPhase() {
  // Your code here
  // Show how poll phase works
  // Use fs.readFile or similar I/O
  // Track when callbacks execute
}

// TODO: Understand check phase (setImmediate)
export function demonstrateCheckPhase() {
  // Your code here
  // Show setImmediate execution
  // Compare with setTimeout(0)
  // Show I/O context behavior
}

// TODO: Demonstrate close callbacks
export function demonstrateCloseCallbacks() {
  // Your code here
  // Create a stream or socket
  // Handle 'close' event
  // Show when it executes
}

// TODO: Show starvation with process.nextTick
export function demonstrateStarvation() {
  // Your code here
  // Show how too many nextTick calls
  // can block the event loop
  // Prevent I/O from happening
}

// TODO: Compare execution in different contexts
export function compareContexts() {
  // Your code here
  // setTimeout vs setImmediate
  // Behavior differs based on context:
  // - Main module (non-I/O)
  // - I/O callback context
}

// Tests
describe('Exercise 168: Event Loop', () => {
  it('should demonstrate execution order', (done) => {
    const order = [];

    console.log('Start');
    order.push('start');

    setTimeout(() => {
      order.push('setTimeout');
    }, 0);

    setImmediate(() => {
      order.push('setImmediate');
    });

    process.nextTick(() => {
      order.push('nextTick');
    });

    Promise.resolve().then(() => {
      order.push('promise');
    });

    console.log('End');
    order.push('end');

    setTimeout(() => {
      // TODO: Add expectations about order
      done();
    }, 50);
  });

  it('should understand timer precision', (done) => {
    const times = [];

    const start = Date.now();

    setTimeout(() => {
      times.push(Date.now() - start);
      // TODO: Add expectations
      // setTimeout(0) is not exactly 0ms
      done();
    }, 0);
  });

  it('should understand setImmediate in I/O context', (done) => {
    const order = [];

    // In I/O context, setImmediate runs before setTimeout(0)
    const fs = require('fs');
    fs.readFile(__filename, () => {
      setTimeout(() => {
        order.push('setTimeout');
      }, 0);

      setImmediate(() => {
        order.push('setImmediate');
      });

      setImmediate(() => {
        // TODO: Add expectations
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
      // TODO: Add expectations
      setTimeout(() => {
        expect(order[0]).toBe('nextTick');
        expect(order[1]).toBe('promise');
        done();
      }, 10);
    });
  });

  it('should demonstrate nextTick recursion limit', (done) => {
    let count = 0;
    let ioExecuted = false;

    function recurse() {
      count++;
      if (count < 100) {
        process.nextTick(recurse);
      }
    }

    recurse();

    setImmediate(() => {
      ioExecuted = true;
      // TODO: Add expectations
      done();
    });
  });

  it('should understand phase transitions', (done) => {
    const events = [];

    setTimeout(() => events.push('timer'), 0);
    setImmediate(() => events.push('check'));
    process.nextTick(() => events.push('nextTick'));
    Promise.resolve().then(() => events.push('microtask'));

    setTimeout(() => {
      // TODO: Add expectations about order
      done();
    }, 50);
  });
});

/**
 * EVENT LOOP VISUALIZATION:
 *
 *    ┌───────────────────────────┐
 * ┌─>│        Timers             │
 * │  └─────────────┬─────────────┘
 * │                │ process.nextTick, microtasks
 * │  ┌─────────────▼─────────────┐
 * │  │     Pending Callbacks     │
 * │  └─────────────┬─────────────┘
 * │                │ process.nextTick, microtasks
 * │  ┌─────────────▼─────────────┐
 * │  │       Idle, Prepare       │
 * │  └─────────────┬─────────────┘
 * │                │ process.nextTick, microtasks
 * │  ┌─────────────▼─────────────┐
 * │  │          Poll             │<─── Wait for I/O
 * │  └─────────────┬─────────────┘
 * │                │ process.nextTick, microtasks
 * │  ┌─────────────▼─────────────┐
 * │  │          Check            │<─── setImmediate
 * │  └─────────────┬─────────────┘
 * │                │ process.nextTick, microtasks
 * │  ┌─────────────▼─────────────┐
 * │  │      Close Callbacks      │
 * │  └─────────────┬─────────────┘
 * └────────────────┘
 *
 * BEST PRACTICES:
 * - Use setImmediate over setTimeout(fn, 0)
 * - Avoid recursive process.nextTick
 * - Understand context affects execution order
 * - Break up long computations with setImmediate
 * - Use nextTick for error-first callbacks
 *
 * DEBUGGING TIPS:
 * - console.log with phase names
 * - Use --trace-warnings flag
 * - Check for blocking operations
 * - Monitor event loop lag
 */
