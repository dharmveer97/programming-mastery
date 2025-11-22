import { describe, it, expect } from 'vitest';

/**
 * Exercise 43: Closures - SOLUTION
 */

export function createCounter() {
  // Private variable - only accessible within this function
  let count = 0;

  // Return an object with methods that form closures
  return {
    increment: function() {
      count++;
    },
    decrement: function() {
      count--;
    },
    getValue: function() {
      return count;
    }
  };
}

export function createGreeter(greeting) {
  // 'greeting' is captured in the closure
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

export function createMultiplier(factor) {
  // 'factor' is captured in the closure
  return function(number) {
    return number * factor;
  };
}

export function createSecret(initialValue) {
  // Private variable
  let value = initialValue;

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
    }
  };
}

// Tests
describe('Exercise 43: Closures - Solution', () => {
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
