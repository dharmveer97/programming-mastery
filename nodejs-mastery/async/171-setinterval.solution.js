import { describe, it, expect } from 'vitest';

/**
 * Exercise 171: setInterval Patterns and Best Practices - SOLUTION
 */

// Basic interval with auto-clear
export function createBasicInterval(callback, delay, duration) {
  const intervalId = setInterval(callback, delay);

  const timeoutId = setTimeout(() => {
    clearInterval(intervalId);
  }, duration);

  return {
    cancel: () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    }
  };
}

// Poll for condition
export function pollForCondition(checkFn, interval, timeout) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      // Check timeout
      if (Date.now() - startTime >= timeout) {
        clearInterval(intervalId);
        reject(new Error('Polling timeout'));
        return;
      }

      // Check condition
      if (checkFn()) {
        clearInterval(intervalId);
        resolve(true);
      }
    }, interval);
  });
}

// Countdown timer
export function createCountdown(seconds, onTick, onComplete) {
  let remaining = seconds;
  let intervalId = null;
  let isPaused = false;

  const tick = () => {
    if (remaining > 0) {
      onTick(remaining);
      remaining--;
    } else {
      clearInterval(intervalId);
      onComplete();
    }
  };

  const start = () => {
    intervalId = setInterval(tick, 1000);
  };

  start();

  return {
    pause: () => {
      if (!isPaused && intervalId) {
        clearInterval(intervalId);
        isPaused = true;
      }
    },
    resume: () => {
      if (isPaused) {
        start();
        isPaused = false;
      }
    },
    cancel: () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  };
}

// Rate-limited interval
export function createRateLimitedInterval(callback, interval, maxExecutions) {
  let count = 0;

  const intervalId = setInterval(() => {
    count++;
    callback();

    if (count >= maxExecutions) {
      clearInterval(intervalId);
    }
  }, interval);

  return {
    cancel: () => clearInterval(intervalId)
  };
}

// Safe interval (prevents overlap)
export function createSafeInterval(asyncCallback, interval) {
  let isRunning = false;
  let isCancelled = false;

  async function scheduleNext() {
    if (isCancelled) return;

    // Wait for interval
    await new Promise(resolve => setTimeout(resolve, interval));

    if (isCancelled) return;

    // Ensure not already running
    if (!isRunning) {
      isRunning = true;
      try {
        await asyncCallback();
      } catch (err) {
        console.error('Callback error:', err);
      } finally {
        isRunning = false;
      }
    }

    scheduleNext();
  }

  scheduleNext();

  return {
    cancel: () => {
      isCancelled = true;
    }
  };
}

// Heartbeat/keepalive
export function createHeartbeat(sendPing, interval, onTimeout) {
  let lastPongTime = Date.now();
  let pingIntervalId = null;
  let checkIntervalId = null;

  const sendPingAndCheck = () => {
    sendPing();

    // Check if we received pong within timeout
    const elapsed = Date.now() - lastPongTime;
    if (elapsed > interval * 2) {
      onTimeout();
      stop();
    }
  };

  const start = () => {
    lastPongTime = Date.now();
    pingIntervalId = setInterval(sendPingAndCheck, interval);
  };

  const stop = () => {
    if (pingIntervalId) {
      clearInterval(pingIntervalId);
      pingIntervalId = null;
    }
  };

  const pong = () => {
    lastPongTime = Date.now();
  };

  start();

  return { start, stop, pong };
}

// Accurate interval with drift correction
export function createAccurateInterval(callback, interval) {
  let expected = Date.now() + interval;
  let timeoutId = null;

  function step() {
    callback();

    const drift = Date.now() - expected;
    expected += interval;

    // Adjust next delay to compensate for drift
    const nextDelay = Math.max(0, interval - drift);

    timeoutId = setTimeout(step, nextDelay);
  }

  timeoutId = setTimeout(step, interval);

  return {
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };
}

// Exponential backoff polling
export function pollWithBackoff(checkFn, initialDelay, maxDelay, timeout) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let currentDelay = initialDelay;

    function check() {
      // Check timeout
      if (Date.now() - startTime >= timeout) {
        reject(new Error('Polling timeout'));
        return;
      }

      // Check condition
      if (checkFn()) {
        resolve(true);
        return;
      }

      // Schedule next check with exponential backoff
      setTimeout(check, currentDelay);
      currentDelay = Math.min(currentDelay * 2, maxDelay);
    }

    setTimeout(check, currentDelay);
  });
}

// Tests
describe('Exercise 171: setInterval - Solution', () => {
  it('should create basic interval', (done) => {
    let count = 0;
    const interval = createBasicInterval(() => {
      count++;
    }, 10, 35);

    setTimeout(() => {
      expect(count).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(4);
      done();
    }, 50);
  });

  it('should cancel interval early', (done) => {
    let count = 0;
    const interval = createBasicInterval(() => {
      count++;
    }, 10, 100);

    setTimeout(() => {
      interval.cancel();
    }, 25);

    setTimeout(() => {
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(3);
      done();
    }, 50);
  });

  it('should poll for condition', async () => {
    let value = 0;
    setTimeout(() => { value = 42; }, 50);

    const result = await pollForCondition(
      () => value === 42,
      10,
      100
    );

    expect(result).toBe(true);
    expect(value).toBe(42);
  });

  it('should timeout if condition not met', async () => {
    try {
      await pollForCondition(() => false, 10, 50);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.message).toContain('timeout');
    }
  });

  it('should create countdown timer', (done) => {
    const ticks = [];
    let completed = false;

    const countdown = createCountdown(
      3,
      (remaining) => ticks.push(remaining),
      () => { completed = true; }
    );

    setTimeout(() => {
      expect(ticks).toEqual([3, 2, 1]);
      expect(completed).toBe(true);
      done();
    }, 3500);
  }, 5000);

  it('should pause and resume countdown', (done) => {
    const ticks = [];

    const countdown = createCountdown(
      5,
      (remaining) => ticks.push(remaining),
      () => {}
    );

    setTimeout(() => {
      countdown.pause();
    }, 1500);

    setTimeout(() => {
      countdown.resume();
    }, 2500);

    setTimeout(() => {
      countdown.cancel();
      // Paused for 1 second, so should have fewer ticks
      expect(ticks.length).toBeLessThan(5);
      done();
    }, 4000);
  }, 5000);

  it('should limit executions', (done) => {
    let count = 0;
    createRateLimitedInterval(() => {
      count++;
    }, 10, 3);

    setTimeout(() => {
      expect(count).toBe(3);
      done();
    }, 100);
  });

  it('should prevent callback overlap', (done) => {
    let running = false;
    let overlapDetected = false;
    let executions = 0;

    createSafeInterval(async () => {
      executions++;
      if (running) {
        overlapDetected = true;
      }
      running = true;
      await new Promise(resolve => setTimeout(resolve, 30));
      running = false;
    }, 10);

    setTimeout(() => {
      expect(overlapDetected).toBe(false);
      expect(executions).toBeGreaterThan(0);
      done();
    }, 100);
  });

  it('should implement heartbeat', (done) => {
    let pings = 0;
    let timeoutCalled = false;

    const heartbeat = createHeartbeat(
      () => { pings++; },
      20,
      () => { timeoutCalled = true; }
    );

    // Simulate pong responses
    setTimeout(() => heartbeat.pong(), 10);
    setTimeout(() => heartbeat.pong(), 30);
    setTimeout(() => heartbeat.pong(), 50);

    setTimeout(() => {
      expect(pings).toBeGreaterThan(0);
      expect(timeoutCalled).toBe(false);
      heartbeat.stop();
      done();
    }, 80);
  });

  it('should timeout without pong', (done) => {
    let timeoutCalled = false;

    const heartbeat = createHeartbeat(
      () => {},
      20,
      () => { timeoutCalled = true; }
    );

    // Don't send pong

    setTimeout(() => {
      expect(timeoutCalled).toBe(true);
      done();
    }, 100);
  });

  it('should correct for drift', (done) => {
    const times = [];
    const start = Date.now();

    const interval = createAccurateInterval(() => {
      times.push(Date.now() - start);
    }, 50);

    setTimeout(() => {
      interval.cancel();
      expect(times.length).toBeGreaterThanOrEqual(3);

      // Check that times are approximately correct
      if (times.length >= 3) {
        expect(times[0]).toBeGreaterThanOrEqual(45);
        expect(times[0]).toBeLessThan(60);
        expect(times[1]).toBeGreaterThanOrEqual(95);
        expect(times[1]).toBeLessThan(110);
      }
      done();
    }, 200);
  });

  it('should poll with exponential backoff', async () => {
    let value = 0;
    let checks = [];

    setTimeout(() => { value = 42; }, 100);

    const start = Date.now();

    await pollWithBackoff(
      () => {
        checks.push(Date.now() - start);
        return value === 42;
      },
      10,
      100,
      500
    );

    expect(value).toBe(42);
    expect(checks.length).toBeGreaterThan(0);
    // Check that delays increase
    if (checks.length >= 3) {
      const delay1 = checks[1] - checks[0];
      const delay2 = checks[2] - checks[1];
      expect(delay2).toBeGreaterThanOrEqual(delay1);
    }
  });
});

/**
 * KEY LEARNINGS:
 *
 * 1. Basic setInterval:
 *    - Returns ID for clearing
 *    - Runs until cleared
 *    - Not guaranteed exact timing
 *
 * 2. Always Clear Intervals:
 *    - Store the ID
 *    - Clear in cleanup
 *    - Use timeouts to auto-clear
 *
 * 3. Safe Patterns:
 *    - Use recursive setTimeout for async work
 *    - Prevent callback overlap
 *    - Handle errors in callbacks
 *
 * 4. Polling Patterns:
 *    - Check condition periodically
 *    - Set timeout limits
 *    - Use exponential backoff
 *
 * 5. Drift Correction:
 *    - Track expected vs actual time
 *    - Adjust next delay
 *    - Use setTimeout recursion
 *
 * 6. Common Use Cases:
 *    - Heartbeat/keepalive
 *    - Polling (sparingly)
 *    - Countdown timers
 *    - Periodic cleanup
 *
 * 7. Anti-patterns:
 *    - Not clearing intervals
 *    - Assuming exact timing
 *    - Using for async operations
 *    - Creating multiple intervals
 *    - No error handling
 *
 * 8. Best Practices:
 *    - Consider event-driven alternatives
 *    - Use setTimeout recursion for control
 *    - Set reasonable intervals
 *    - Handle errors
 *    - Clean up properly
 */
