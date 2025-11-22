import { describe, it, expect } from 'vitest';

/**
 * Exercise 43: Closures
 *
 * A closure is a function that has access to variables
 * from its outer (enclosing) function, even after the
 * outer function has returned.
 *
 * Key concepts:
 * - Inner function can access outer function's variables
 * - Variables are "remembered" even after outer function finishes
 * - Used for data privacy and creating function factories
 *
 * Task: Understand and implement closures
 */

// TODO: Create a counter function using closure
// Return an object with increment, decrement, and getValue methods
export function createCounter() {
  // Your code here
  // Hint: Use a private variable that persists
}

// TODO: Create a function that generates greeting functions
// Input: createGreeter('Hello') returns a function that adds 'Hello' to any name
// Example: const greet = createGreeter('Hello'); greet('Alice') => 'Hello, Alice!'
export function createGreeter(greeting) {
  // Your code here
}

// TODO: Create a multiplier function factory
// Example: const double = createMultiplier(2); double(5) => 10
export function createMultiplier(factor) {
  // Your code here
}

// TODO: Create a private variable holder
// Return an object with get and set methods
export function createSecret(initialValue) {
  // Your code here
}

// Tests
describe('Exercise 43: Closures', () => {
  it('should create a counter with closure', () => {
    const counter = createCounter();
    expect(counter.getValue()).toBe(0);

    counter.increment();
    expect(counter.getValue()).toBe(1);

    counter.increment();
    expect(counter.getValue()).toBe(2);

    counter.decrement();
    expect(counter.getValue()).toBe(1);
  });

  it('should create greeter functions', () => {
    const greetHello = createGreeter('Hello');
    const greetHi = createGreeter('Hi');

    expect(greetHello('Alice')).toBe('Hello, Alice!');
    expect(greetHi('Bob')).toBe('Hi, Bob!');
  });

  it('should create multiplier functions', () => {
    const double = createMultiplier(2);
    const triple = createMultiplier(3);

    expect(double(5)).toBe(10);
    expect(triple(5)).toBe(15);
    expect(double(10)).toBe(20);
  });

  it('should create private variable holder', () => {
    const secret = createSecret('my secret');

    expect(secret.get()).toBe('my secret');

    secret.set('new secret');
    expect(secret.get()).toBe('new secret');
  });

  it('should maintain separate closure instances', () => {
    const counter1 = createCounter();
    const counter2 = createCounter();

    counter1.increment();
    counter1.increment();

    counter2.increment();

    expect(counter1.getValue()).toBe(2);
    expect(counter2.getValue()).toBe(1);
  });
});
