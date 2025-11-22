import { describe, it, expect } from 'vitest';

/**
 * Exercise 01: Variables (var, let, const) - SOLUTION
 */

// userName can be reassigned, so we use let
export let userName = 'John Doe';

// PI is a constant value that should never change
export const PI = 3.14159;

// counter needs to be reassigned, so we use let
export let counter = 0;

// isLoggedIn is a boolean flag that can change
export let isLoggedIn = false;

// Tests
describe('Exercise 01: Variables - Solution', () => {
  it('should have userName defined', () => {
    expect(userName).toBe('John Doe');
  });

  it('should have PI constant defined', () => {
    expect(PI).toBe(3.14159);
  });

  it('should have counter defined and reassignable', () => {
    expect(counter).toBe(0);
    counter = 10;
    expect(counter).toBe(10);
  });

  it('should have isLoggedIn defined', () => {
    expect(isLoggedIn).toBe(false);
  });
});
