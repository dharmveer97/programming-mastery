import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'events';

/**
 * Exercise 172: Building Custom Event Emitters
 *
 * Event Emitters are the foundation of Node.js event-driven architecture.
 *
 * CORE CONCEPTS:
 * - Publish/Subscribe pattern
 * - Loosely coupled components
 * - Asynchronous event handling
 * - Many-to-many communication
 *
 * BASIC USAGE:
 * const emitter = new EventEmitter();
 * emitter.on('event', handler);
 * emitter.emit('event', data);
 *
 * KEY METHODS:
 * - on(event, listener) - Add listener
 * - once(event, listener) - Add one-time listener
 * - emit(event, ...args) - Trigger event
 * - off/removeListener(event, listener) - Remove listener
 * - removeAllListeners([event]) - Remove all
 *
 * ADVANCED FEATURES:
 * - Error events (special handling)
 * - Listener limits (prevent memory leaks)
 * - Prepend listeners (order control)
 * - Event names (string or symbol)
 *
 * Task: Build custom event emitters with practical patterns
 */

// TODO: Create a basic event emitter class
export class SimpleEventEmitter {
  // Your code here
  // Implement:
  // - on(event, listener)
  // - emit(event, ...args)
  // - off(event, listener)
  // - Use Map or Object to store listeners
}

// TODO: Add 'once' functionality
export class EventEmitterWithOnce extends SimpleEventEmitter {
  // Your code here
  // Add once(event, listener) method
  // Listener should be called only once
  // Then automatically removed
}

// TODO: Create a custom emitter for a task queue
export class TaskQueue extends EventEmitter {
  // Your code here
  // Events: 'task:added', 'task:completed', 'task:failed', 'drain'
  // Methods: addTask(task), processTasks()
  // Emit events at appropriate times
}

// TODO: Implement a timer with events
export class EventTimer extends EventEmitter {
  // Your code here
  // Events: 'tick', 'start', 'stop', 'complete'
  // Methods: start(duration, interval), stop()
  // Emit tick every interval
  // Emit complete when duration reached
}

// TODO: Create a custom stream-like emitter
export class DataStream extends EventEmitter {
  // Your code here
  // Events: 'data', 'end', 'error'
  // Methods: push(data), end()
  // Emit data chunks
  // Handle backpressure with pausing
}

// TODO: Implement error handling pattern
export class SafeEventEmitter extends EventEmitter {
  // Your code here
  // Override emit to handle errors
  // If 'error' event and no listeners, don't crash
  // Log error instead
  // Implement try-catch around listener calls
}

// TODO: Create event emitter with namespaces
export class NamespacedEmitter extends EventEmitter {
  // Your code here
  // Support event namespaces: 'user:login', 'user:logout'
  // Allow wildcard listeners: 'user:*'
  // Methods: onNamespace(pattern, listener)
}

// TODO: Implement event emitter with async support
export class AsyncEventEmitter extends EventEmitter {
  // Your code here
  // Override emit to handle async listeners
  // Wait for all async listeners to complete
  // Return promise from emit
  // Handle errors from async listeners
}

// Tests
describe('Exercise 172: Custom Event Emitters', () => {
  it('should create basic event emitter', () => {
    const emitter = new SimpleEventEmitter();
    let called = false;

    emitter.on('test', () => {
      called = true;
    });

    emitter.emit('test');
    // TODO: Add expectations
  });

  it('should pass arguments to listeners', () => {
    const emitter = new SimpleEventEmitter();
    let receivedData = null;

    emitter.on('data', (data) => {
      receivedData = data;
    });

    emitter.emit('data', { value: 42 });
    // TODO: Add expectations
  });

  it('should support multiple listeners', () => {
    const emitter = new SimpleEventEmitter();
    const calls = [];

    emitter.on('event', () => calls.push(1));
    emitter.on('event', () => calls.push(2));

    emitter.emit('event');
    // TODO: Add expectations
  });

  it('should implement once', () => {
    const emitter = new EventEmitterWithOnce();
    let count = 0;

    emitter.once('event', () => {
      count++;
    });

    emitter.emit('event');
    emitter.emit('event');
    emitter.emit('event');

    // TODO: Add expectations
  });

  it('should implement task queue', (done) => {
    const queue = new TaskQueue();
    const completed = [];

    queue.on('task:completed', (result) => {
      completed.push(result);
    });

    queue.on('drain', () => {
      // TODO: Add expectations
      done();
    });

    queue.addTask(async () => 'task1');
    queue.addTask(async () => 'task2');
    queue.processTasks();
  });

  it('should implement event timer', (done) => {
    const timer = new EventTimer();
    let ticks = 0;

    timer.on('tick', () => {
      ticks++;
    });

    timer.on('complete', () => {
      // TODO: Add expectations
      done();
    });

    timer.start(100, 25);
  });

  it('should implement data stream', (done) => {
    const stream = new DataStream();
    const chunks = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      // TODO: Add expectations
      done();
    });

    stream.push('chunk1');
    stream.push('chunk2');
    stream.end();
  });

  it('should handle errors safely', () => {
    const emitter = new SafeEventEmitter();

    // Should not crash
    emitter.emit('error', new Error('Test error'));

    // TODO: Add expectations
  });

  it('should support namespaced events', () => {
    const emitter = new NamespacedEmitter();
    const events = [];

    emitter.onNamespace('user:*', (event) => {
      events.push(event);
    });

    emitter.emit('user:login', { id: 1 });
    emitter.emit('user:logout', { id: 1 });
    emitter.emit('system:startup');

    // TODO: Add expectations
  });

  it('should support async listeners', async () => {
    const emitter = new AsyncEventEmitter();
    const order = [];

    emitter.on('event', async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      order.push(1);
    });

    emitter.on('event', async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
      order.push(2);
    });

    await emitter.emit('event');

    // TODO: Add expectations
  });
});

/**
 * EVENT EMITTER PATTERNS:
 *
 * 1. Basic Pattern:
 *    class MyEmitter extends EventEmitter {
 *      doSomething() {
 *        // ... work
 *        this.emit('done', result);
 *      }
 *    }
 *
 * 2. Error Handling:
 *    emitter.on('error', (err) => {
 *      console.error('Error:', err);
 *    });
 *
 * 3. Once Pattern:
 *    emitter.once('ready', () => {
 *      // Called only first time
 *    });
 *
 * 4. Cleanup:
 *    emitter.removeListener('event', handler);
 *    emitter.removeAllListeners();
 *
 * 5. Memory Leak Detection:
 *    emitter.setMaxListeners(20);
 *
 * BEST PRACTICES:
 * - Always handle 'error' events
 * - Remove listeners in cleanup
 * - Use once for one-time events
 * - Set max listeners to prevent leaks
 * - Document emitted events
 * - Use symbols for private events
 * - Consider async listeners carefully
 *
 * COMMON USE CASES:
 * - Streams (data, end, error)
 * - HTTP servers (request, close)
 * - Custom APIs (progress, complete)
 * - Task queues (task:start, task:end)
 * - State changes (change, update)
 *
 * ANTI-PATTERNS:
 * - Not handling errors
 * - Memory leaks (too many listeners)
 * - Synchronous heavy work in listeners
 * - Emitting in constructor (not ready yet)
 * - Not documenting events
 */
