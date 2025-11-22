import { describe, it, expect } from 'vitest';

/**
 * Exercise 171: setInterval Patterns and Best Practices
 *
 * setInterval executes a function repeatedly with a fixed time delay.
 *
 * BASIC USAGE:
 * const intervalId = setInterval(callback, delay);
 * clearInterval(intervalId); // Stop it
 *
 * KEY CONCEPTS:
 * - Runs callback every 'delay' milliseconds
 * - Returns an ID to clear the interval
 * - Continues until cleared
 * - Delay is minimum, not guaranteed
 *
 * COMMON PATTERNS:
 * 1. Polling - Check for updates
 * 2. Heartbeat - Keep connection alive
 * 3. Animation - Update UI periodically
 * 4. Cleanup - Periodic maintenance
 *
 * IMPORTANT WARNINGS:
 * - Always clear intervals when done
 * - Don't nest intervals (creates multiple!)
 * - Long-running callbacks can overlap
 * - Intervals drift over time
 *
 * ALTERNATIVES:
 * - setTimeout recursion (better control)
 * - requestAnimationFrame (browser, smoother)
 * - Event-driven approaches (more efficient)
 *
 * Task: Master setInterval patterns and pitfalls
 */

// TODO: Create a basic interval
export function createBasicInterval(callback, delay, duration) {
  // Your code here
  // Run callback every 'delay' ms
  // Stop after 'duration' ms
  // Return object with cancel method
}

// TODO: Implement polling with interval
export function pollForCondition(checkFn, interval, timeout) {
  // Your code here
  // Check condition every 'interval' ms
  // Resolve when checkFn returns true
  // Reject if timeout exceeded
  // Return a promise
}

// TODO: Create a countdown timer
export function createCountdown(seconds, onTick, onComplete) {
  // Your code here
  // Count down from 'seconds' to 0
  // Call onTick(remaining) each second
  // Call onComplete() when done
  // Return object with pause/resume/cancel methods
}

// TODO: Implement rate-limited interval
export function createRateLimitedInterval(callback, interval, maxExecutions) {
  // Your code here
  // Run callback up to maxExecutions times
  // Then automatically stop
}

// TODO: Create safe interval (prevents overlap)
export function createSafeInterval(asyncCallback, interval) {
  // Your code here
  // Ensure callback finishes before next execution
  // Don't start new execution if previous is running
  // Use setTimeout recursion instead of setInterval
}

// TODO: Implement heartbeat/keepalive
export function createHeartbeat(sendPing, interval, onTimeout) {
  // Your code here
  // Send ping every 'interval' ms
  // Track if pong received
  // Call onTimeout if no pong within interval * 2
  // Return start/stop/pong methods
}

// TODO: Create interval with drift correction
export function createAccurateInterval(callback, interval) {
  // Your code here
  // Correct for drift over time
  // Track actual vs expected execution time
  // Adjust next delay accordingly
}

// TODO: Implement exponential backoff polling
export function pollWithBackoff(checkFn, initialDelay, maxDelay, timeout) {
  // Your code here
  // Start with initialDelay
  // Double delay after each check (up to maxDelay)
  // Stop when condition met or timeout
  // Return promise
}

// Tests
describe('Exercise 171: setInterval', () => {
  it('should create basic interval', (done) => {
    let count = 0;
    const interval = createBasicInterval(() => {
      count++;
    }, 10, 35);

    setTimeout(() => {
      // TODO: Add expectations
      // Should run about 3 times
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

    // TODO: Add expectations
  });

  it('should timeout if condition not met', async () => {
    try {
      await pollForCondition(() => false, 10, 50);
      // TODO: Should not reach here
    } catch (err) {
      // TODO: Add expectations
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
      // TODO: Add expectations
      done();
    }, 3500);
  });

  it('should limit executions', (done) => {
    let count = 0;
    createRateLimitedInterval(() => {
      count++;
    }, 10, 3);

    setTimeout(() => {
      // TODO: Add expectations
      // Should execute exactly 3 times
      done();
    }, 100);
  });

  it('should prevent callback overlap', (done) => {
    let running = false;
    let overlapDetected = false;

    createSafeInterval(async () => {
      if (running) {
        overlapDetected = true;
      }
      running = true;
      await new Promise(resolve => setTimeout(resolve, 30));
      running = false;
    }, 10);

    setTimeout(() => {
      // TODO: Add expectations
      // Should never overlap
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
    // TODO: Test heartbeat functionality

    setTimeout(() => {
      done();
    }, 100);
  });

  it('should correct for drift', (done) => {
    const times = [];
    const start = Date.now();

    createAccurateInterval(() => {
      times.push(Date.now() - start);
    }, 50);

    setTimeout(() => {
      // TODO: Add expectations
      // Times should be approximately 50, 100, 150, etc.
      done();
    }, 200);
  });
});

/**
 * SETINTERVAL PATTERNS:
 *
 * 1. Basic Pattern:
 *    const id = setInterval(() => {
 *      // do work
 *    }, 1000);
 *    clearInterval(id);
 *
 * 2. Self-Clearing:
 *    let count = 0;
 *    const id = setInterval(() => {
 *      count++;
 *      if (count >= 10) clearInterval(id);
 *    }, 1000);
 *
 * 3. Safe Pattern (no overlap):
 *    function scheduleNext() {
 *      setTimeout(async () => {
 *        await doWork();
 *        scheduleNext();
 *      }, 1000);
 *    }
 *
 * 4. Polling Pattern:
 *    const id = setInterval(() => {
 *      if (condition) {
 *        clearInterval(id);
 *        resolve();
 *      }
 *    }, 100);
 *
 * COMMON MISTAKES:
 * - Forgetting to clear interval
 * - Assuming exact timing
 * - Not handling async callbacks
 * - Creating multiple intervals
 * - No error handling
 *
 * BEST PRACTICES:
 * - Always store interval ID
 * - Clear in cleanup/unmount
 * - Use setTimeout recursion for async work
 * - Consider event-driven alternatives
 * - Handle errors in callbacks
 * - Set reasonable intervals (not too frequent)
 *
 * WHEN TO USE:
 * - Polling (sparingly)
 * - Heartbeats
 * - Simple periodic tasks
 * - UI updates (or use requestAnimationFrame)
 *
 * WHEN NOT TO USE:
 * - Async operations (use recursive setTimeout)
 * - High-frequency updates (use events)
 * - Precise timing (intervals drift)
 * - Long-running tasks (blocks event loop)
 */
