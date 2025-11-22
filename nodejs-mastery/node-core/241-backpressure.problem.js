import { describe, it, expect } from 'vitest';
import { Readable, Writable, Transform } from 'stream';

/**
 * Exercise 241: Backpressure - Understanding and Handling Stream Backpressure
 *
 * Backpressure occurs when data is being written faster than it can be consumed.
 * Proper handling prevents memory issues and ensures efficient data flow.
 *
 * Key concepts:
 * - write() returns false when buffer is full
 * - 'drain' event signals buffer is ready for more data
 * - highWaterMark controls buffer size
 * - Automatic backpressure with pipe/pipeline
 * - Manual backpressure handling
 *
 * Task: Understand and handle backpressure correctly
 */

// TODO: Detect when backpressure occurs
// Return true if write() indicates backpressure, false otherwise
export function detectBackpressure(stream, data) {
  // Your code here
  // Hint: Check the return value of write()
}

// TODO: Write data respecting backpressure
// Wait for drain events when buffer is full
export function writeWithBackpressure(stream, dataArray) {
  return new Promise((resolve, reject) => {
    let index = 0;

    function write() {
      // Your code here
      // Hint: Write while return is true, wait for drain when false
    }

    // Your code here
  });
}

// TODO: Create a slow consumer stream
// Process data slowly to demonstrate backpressure
export function createSlowConsumer(delay = 10) {
  return new Writable({
    write(chunk, encoding, callback) {
      // Your code here
      // Hint: Use setTimeout to simulate slow processing
    }
  });
}

// TODO: Monitor backpressure events
// Count how many times drain event fires
export function monitorBackpressure(stream, dataArray) {
  return new Promise((resolve, reject) => {
    let drainCount = 0;

    // Your code here
    // Hint: Listen to 'drain' event and count occurrences
  });
}

// TODO: Create a transform with backpressure handling
// Transform stream that respects backpressure
export function createBackpressureTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      // Your code here
      // Hint: Process chunk and call callback appropriately
    }
  });
}

// TODO: Handle backpressure with different highWaterMark values
// Return how buffer size affects backpressure
export async function testHighWaterMark(highWaterMark, dataSize) {
  let backpressureOccurred = false;

  const stream = new Writable({
    highWaterMark,
    write(chunk, encoding, callback) {
      setImmediate(callback);
    }
  });

  // Your code here
  // Hint: Write data and check if write() returns false
}

// TODO: Implement a rate limiter using backpressure
// Limit write rate using backpressure mechanism
export function createRateLimiter(maxPerSecond) {
  let count = 0;
  let lastReset = Date.now();

  return new Writable({
    write(chunk, encoding, callback) {
      // Your code here
      // Hint: Track writes per second and delay when limit reached
    }
  });
}

// TODO: Compare automatic vs manual backpressure handling
// Return 'manual' or 'automatic' based on approach used
export async function compareBackpressure(useAutomatic) {
  const source = new Readable({
    read() {
      this.push('x'.repeat(1000));
      if (Math.random() > 0.95) {
        this.push(null);
      }
    }
  });

  const dest = new Writable({
    highWaterMark: 100,
    write(chunk, encoding, callback) {
      setImmediate(callback);
    }
  });

  if (useAutomatic) {
    // Your code here - use pipe
  } else {
    // Your code here - manual handling
  }
}

// Tests
describe('Exercise 241: Backpressure', () => {
  it('should detect backpressure', () => {
    const stream = new Writable({
      highWaterMark: 1,
      write(chunk, encoding, callback) {
        // Don't call callback immediately to simulate slow consumer
      }
    });

    // First write succeeds
    const first = detectBackpressure(stream, 'a');
    expect(first).toBe(false);

    // Second write causes backpressure
    const second = detectBackpressure(stream, 'b');
    expect(second).toBe(true);
  });

  it('should write with backpressure handling', async () => {
    const chunks = [];
    const stream = new Writable({
      highWaterMark: 16,
      write(chunk, encoding, callback) {
        chunks.push(chunk.toString());
        setImmediate(callback);
      }
    });

    const data = Array(100).fill('x'.repeat(10));
    await writeWithBackpressure(stream, data);

    expect(chunks.length).toBe(100);
  });

  it('should create slow consumer', async () => {
    const stream = createSlowConsumer(5);
    const start = Date.now();

    stream.write('chunk1');
    stream.write('chunk2');
    stream.end();

    await new Promise(resolve => stream.on('finish', resolve));

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThan(5);
  });

  it('should monitor backpressure events', async () => {
    const stream = new Writable({
      highWaterMark: 10,
      write(chunk, encoding, callback) {
        setImmediate(callback);
      }
    });

    const data = Array(50).fill('x'.repeat(10));
    const drainCount = await monitorBackpressure(stream, data);

    expect(drainCount).toBeGreaterThan(0);
  });

  it('should handle backpressure in transform', async () => {
    const transform = createBackpressureTransform();
    const chunks = [];

    transform.on('data', (chunk) => {
      chunks.push(chunk.toString());
    });

    transform.write('hello');
    transform.write('world');
    transform.end();

    await new Promise(resolve => transform.on('end', resolve));

    expect(chunks.length).toBeGreaterThan(0);
  });

  it('should test highWaterMark effects', async () => {
    // Small buffer - backpressure occurs
    const smallBuffer = await testHighWaterMark(10, 100);
    expect(smallBuffer).toBe(true);

    // Large buffer - no backpressure
    const largeBuffer = await testHighWaterMark(1000, 100);
    expect(largeBuffer).toBe(false);
  });

  it('should implement rate limiter', async () => {
    const limiter = createRateLimiter(10);
    const start = Date.now();

    // Try to write 20 items (should take ~2 seconds at 10/sec)
    for (let i = 0; i < 20; i++) {
      limiter.write(`item${i}`);
    }
    limiter.end();

    await new Promise(resolve => limiter.on('finish', resolve));

    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThan(1000); // Should take at least 1 second
  });

  it('should compare backpressure handling approaches', async () => {
    const automatic = await compareBackpressure(true);
    expect(automatic).toBe('automatic');

    const manual = await compareBackpressure(false);
    expect(manual).toBe('manual');
  });
});
