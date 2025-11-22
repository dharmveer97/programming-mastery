import { describe, it, expect } from 'vitest';
import { Readable, Writable, Transform } from 'stream';

/**
 * Exercise 241: Backpressure - SOLUTION
 */

export function detectBackpressure(stream, data) {
  const canContinue = stream.write(data);
  return !canContinue; // Returns true if backpressure occurred
}

export function writeWithBackpressure(stream, dataArray) {
  return new Promise((resolve, reject) => {
    let index = 0;

    stream.on('error', reject);
    stream.on('finish', resolve);

    function write() {
      let ok = true;

      while (index < dataArray.length && ok) {
        ok = stream.write(dataArray[index]);
        index++;
      }

      if (index < dataArray.length) {
        // Buffer is full, wait for drain
        stream.once('drain', write);
      } else {
        // All data written
        stream.end();
      }
    }

    write();
  });
}

export function createSlowConsumer(delay = 10) {
  return new Writable({
    write(chunk, encoding, callback) {
      setTimeout(() => {
        callback();
      }, delay);
    }
  });
}

export function monitorBackpressure(stream, dataArray) {
  return new Promise((resolve, reject) => {
    let drainCount = 0;

    stream.on('drain', () => {
      drainCount++;
    });

    stream.on('error', reject);
    stream.on('finish', () => {
      resolve(drainCount);
    });

    let index = 0;

    function write() {
      let ok = true;

      while (index < dataArray.length && ok) {
        ok = stream.write(dataArray[index]);
        index++;
      }

      if (index < dataArray.length) {
        stream.once('drain', write);
      } else {
        stream.end();
      }
    }

    write();
  });
}

export function createBackpressureTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      // Process the chunk
      this.push(chunk);
      callback();
    }
  });
}

export async function testHighWaterMark(highWaterMark, dataSize) {
  let backpressureOccurred = false;

  const stream = new Writable({
    highWaterMark,
    write(chunk, encoding, callback) {
      setImmediate(callback);
    }
  });

  for (let i = 0; i < dataSize; i++) {
    const canContinue = stream.write('x');
    if (!canContinue) {
      backpressureOccurred = true;
    }
  }

  stream.end();

  await new Promise(resolve => stream.on('finish', resolve));

  return backpressureOccurred;
}

export function createRateLimiter(maxPerSecond) {
  let count = 0;
  let lastReset = Date.now();

  return new Writable({
    write(chunk, encoding, callback) {
      const now = Date.now();

      // Reset counter every second
      if (now - lastReset >= 1000) {
        count = 0;
        lastReset = now;
      }

      count++;

      if (count > maxPerSecond) {
        // Exceeded rate limit, delay
        const delay = 1000 - (now - lastReset);
        setTimeout(() => {
          count = 1;
          lastReset = Date.now();
          callback();
        }, delay);
      } else {
        callback();
      }
    }
  });
}

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
    // Automatic backpressure handling with pipe
    source.pipe(dest);
    await new Promise(resolve => dest.on('finish', resolve));
    return 'automatic';
  } else {
    // Manual backpressure handling
    return new Promise((resolve, reject) => {
      source.on('data', (chunk) => {
        const canContinue = dest.write(chunk);
        if (!canContinue) {
          source.pause();
          dest.once('drain', () => {
            source.resume();
          });
        }
      });

      source.on('end', () => {
        dest.end();
      });

      dest.on('finish', () => {
        resolve('manual');
      });

      dest.on('error', reject);
      source.on('error', reject);
    });
  }
}

// Tests
describe('Exercise 241: Backpressure - Solution', () => {
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
