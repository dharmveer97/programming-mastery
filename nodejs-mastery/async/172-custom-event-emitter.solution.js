import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'events';

/**
 * Exercise 172: Building Custom Event Emitters - SOLUTION
 */

// Basic event emitter
export class SimpleEventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return this;
  }

  emit(event, ...args) {
    if (!this.events.has(event)) {
      return false;
    }

    const listeners = this.events.get(event);
    listeners.forEach(listener => {
      listener(...args);
    });

    return true;
  }

  off(event, listener) {
    if (!this.events.has(event)) {
      return this;
    }

    const listeners = this.events.get(event);
    const index = listeners.indexOf(listener);

    if (index !== -1) {
      listeners.splice(index, 1);
    }

    return this;
  }

  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}

// Event emitter with once
export class EventEmitterWithOnce extends SimpleEventEmitter {
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };

    this.on(event, onceWrapper);
    return this;
  }
}

// Task queue with events
export class TaskQueue extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
    this.processing = false;
  }

  addTask(task) {
    this.tasks.push(task);
    this.emit('task:added', task);
    return this;
  }

  async processTasks() {
    if (this.processing) return;
    this.processing = true;

    while (this.tasks.length > 0) {
      const task = this.tasks.shift();

      try {
        const result = await task();
        this.emit('task:completed', result);
      } catch (err) {
        this.emit('task:failed', err);
      }
    }

    this.processing = false;
    this.emit('drain');
  }
}

// Timer with events
export class EventTimer extends EventEmitter {
  constructor() {
    super();
    this.intervalId = null;
    this.timeoutId = null;
  }

  start(duration, interval) {
    this.emit('start');

    let elapsed = 0;

    this.intervalId = setInterval(() => {
      elapsed += interval;
      this.emit('tick', elapsed);

      if (elapsed >= duration) {
        this.stop();
        this.emit('complete');
      }
    }, interval);

    return this;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.emit('stop');
    return this;
  }
}

// Data stream
export class DataStream extends EventEmitter {
  constructor() {
    super();
    this.ended = false;
    this.paused = false;
  }

  push(data) {
    if (this.ended) {
      throw new Error('Cannot push after end');
    }

    if (!this.paused) {
      this.emit('data', data);
    }

    return this;
  }

  end() {
    if (!this.ended) {
      this.ended = true;
      this.emit('end');
    }
    return this;
  }

  pause() {
    this.paused = true;
    return this;
  }

  resume() {
    this.paused = false;
    return this;
  }
}

// Safe event emitter
export class SafeEventEmitter extends EventEmitter {
  emit(event, ...args) {
    // Special handling for error events
    if (event === 'error') {
      if (this.listenerCount('error') === 0) {
        console.error('Uncaught error event:', args[0]);
        return false;
      }
    }

    const listeners = this.listeners(event);

    listeners.forEach(listener => {
      try {
        listener(...args);
      } catch (err) {
        // Emit error event for listener errors
        if (event !== 'error') {
          this.emit('error', err);
        } else {
          console.error('Error in error handler:', err);
        }
      }
    });

    return listeners.length > 0;
  }
}

// Namespaced emitter
export class NamespacedEmitter extends EventEmitter {
  onNamespace(pattern, listener) {
    // Convert pattern to regex
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*') + '$'
    );

    const wrappedListener = (event, ...args) => {
      if (regex.test(event)) {
        listener(event, ...args);
      }
    };

    // Listen to all events
    this.on('**', wrappedListener);
    return this;
  }

  emit(event, ...args) {
    // Emit to specific event
    super.emit(event, ...args);
    // Emit to wildcard listeners
    super.emit('**', event, ...args);
    return this;
  }
}

// Async event emitter
export class AsyncEventEmitter extends EventEmitter {
  async emit(event, ...args) {
    const listeners = this.listeners(event);

    if (listeners.length === 0) {
      return false;
    }

    const promises = listeners.map(listener => {
      try {
        const result = listener(...args);
        // Handle both sync and async listeners
        return Promise.resolve(result);
      } catch (err) {
        return Promise.reject(err);
      }
    });

    try {
      await Promise.all(promises);
      return true;
    } catch (err) {
      // Emit error event for async errors
      if (event !== 'error') {
        super.emit('error', err);
      }
      throw err;
    }
  }
}

// Tests
describe('Exercise 172: Custom Event Emitters - Solution', () => {
  it('should create basic event emitter', () => {
    const emitter = new SimpleEventEmitter();
    let called = false;

    emitter.on('test', () => {
      called = true;
    });

    emitter.emit('test');
    expect(called).toBe(true);
  });

  it('should pass arguments to listeners', () => {
    const emitter = new SimpleEventEmitter();
    let receivedData = null;

    emitter.on('data', (data) => {
      receivedData = data;
    });

    emitter.emit('data', { value: 42 });
    expect(receivedData).toEqual({ value: 42 });
  });

  it('should support multiple listeners', () => {
    const emitter = new SimpleEventEmitter();
    const calls = [];

    emitter.on('event', () => calls.push(1));
    emitter.on('event', () => calls.push(2));

    emitter.emit('event');
    expect(calls).toEqual([1, 2]);
  });

  it('should remove listeners', () => {
    const emitter = new SimpleEventEmitter();
    let count = 0;

    const handler = () => count++;

    emitter.on('event', handler);
    emitter.emit('event');
    expect(count).toBe(1);

    emitter.off('event', handler);
    emitter.emit('event');
    expect(count).toBe(1); // Still 1, not called again
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

    expect(count).toBe(1);
  });

  it('should implement task queue', (done) => {
    const queue = new TaskQueue();
    const completed = [];

    queue.on('task:completed', (result) => {
      completed.push(result);
    });

    queue.on('drain', () => {
      expect(completed).toEqual(['task1', 'task2']);
      done();
    });

    queue.addTask(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'task1';
    });
    queue.addTask(async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
      return 'task2';
    });

    queue.processTasks();
  });

  it('should handle task failures', (done) => {
    const queue = new TaskQueue();
    const failed = [];

    queue.on('task:failed', (err) => {
      failed.push(err.message);
    });

    queue.on('drain', () => {
      expect(failed).toHaveLength(1);
      expect(failed[0]).toBe('Task failed');
      done();
    });

    queue.addTask(async () => {
      throw new Error('Task failed');
    });

    queue.processTasks();
  });

  it('should implement event timer', (done) => {
    const timer = new EventTimer();
    let ticks = 0;

    timer.on('tick', () => {
      ticks++;
    });

    timer.on('complete', () => {
      expect(ticks).toBeGreaterThanOrEqual(3);
      expect(ticks).toBeLessThanOrEqual(5);
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
      expect(chunks).toEqual(['chunk1', 'chunk2']);
      done();
    });

    stream.push('chunk1');
    stream.push('chunk2');
    stream.end();
  });

  it('should handle errors safely', () => {
    const emitter = new SafeEventEmitter();

    // Should not crash when no error listener
    expect(() => {
      emitter.emit('error', new Error('Test error'));
    }).not.toThrow();
  });

  it('should handle listener errors', () => {
    const emitter = new SafeEventEmitter();
    const errors = [];

    emitter.on('error', (err) => {
      errors.push(err);
    });

    emitter.on('event', () => {
      throw new Error('Listener error');
    });

    emitter.emit('event');
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Listener error');
  });

  it('should support namespaced events', () => {
    const emitter = new NamespacedEmitter();
    const events = [];

    emitter.onNamespace('user:*', (event, data) => {
      events.push(event);
    });

    emitter.emit('user:login', { id: 1 });
    emitter.emit('user:logout', { id: 1 });
    emitter.emit('system:startup');

    expect(events).toEqual(['user:login', 'user:logout']);
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

    expect(order).toHaveLength(2);
    expect(order).toContain(1);
    expect(order).toContain(2);
  });

  it('should handle async listener errors', async () => {
    const emitter = new AsyncEventEmitter();
    const errors = [];

    emitter.on('error', (err) => {
      errors.push(err);
    });

    emitter.on('event', async () => {
      throw new Error('Async error');
    });

    try {
      await emitter.emit('event');
    } catch (err) {
      expect(err.message).toBe('Async error');
    }
  });

  it('should demonstrate real-world pattern', (done) => {
    class FileProcessor extends EventEmitter {
      async processFiles(files) {
        this.emit('start', files.length);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.emit('progress', i + 1, files.length);

          try {
            await this.processFile(file);
            this.emit('file:complete', file);
          } catch (err) {
            this.emit('file:error', file, err);
          }
        }

        this.emit('complete');
      }

      async processFile(file) {
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 10));
        return file;
      }
    }

    const processor = new FileProcessor();
    const events = [];

    processor.on('start', (count) => events.push(`start:${count}`));
    processor.on('progress', (current, total) => events.push(`progress:${current}/${total}`));
    processor.on('complete', () => events.push('complete'));

    processor.on('complete', () => {
      expect(events).toContain('start:3');
      expect(events).toContain('complete');
      done();
    });

    processor.processFiles(['file1', 'file2', 'file3']);
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Event Emitter Basics:
 *    - on/emit pattern for pub/sub
 *    - Store listeners in Map or Array
 *    - Call all listeners when event emitted
 *
 * 2. Once Implementation:
 *    - Wrap listener in auto-remove function
 *    - Remove after first call
 *    - Useful for one-time events
 *
 * 3. Error Handling:
 *    - Always handle 'error' events
 *    - Try/catch around listener calls
 *    - Don't crash on errors
 *
 * 4. Memory Management:
 *    - Remove listeners when done
 *    - Set max listener limits
 *    - Use once for temporary listeners
 *
 * 5. Custom Emitters:
 *    - Extend EventEmitter
 *    - Document emitted events
 *    - Emit at appropriate times
 *    - Use descriptive event names
 *
 * 6. Advanced Patterns:
 *    - Namespaced events
 *    - Async listeners
 *    - Wildcard matching
 *    - Event bubbling
 *
 * 7. Best Practices:
 *    - Handle all errors
 *    - Remove listeners in cleanup
 *    - Document events in JSDoc
 *    - Use symbols for private events
 *    - Keep listeners simple
 *    - Consider memory leaks
 *
 * 8. Common Use Cases:
 *    - Streams (data/end/error)
 *    - Task queues
 *    - State changes
 *    - Progress tracking
 *    - Custom APIs
 */
