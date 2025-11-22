import { describe, it, expect } from 'vitest';

/**
 * Exercise 01: Variables (var, let, const)
 *
 * Learn the differences between var, let, and const:
 * - var: function-scoped, can be redeclared
 * - let: block-scoped, cannot be redeclared
 * - const: block-scoped, cannot be reassigned
 *
 * Task: Fix the variable declarations to make tests pass
 */

// TODO: Declare a variable 'userName' with value 'John Doe'
// Use the appropriate keyword (let/const)


// TODO: Declare a constant 'PI' with value 3.14159


// TODO: Declare a variable 'counter' with value 0
// This should be reassignable


// TODO: Declare a variable 'isLoggedIn' with value false


// Tests
describe('Exercise 01: Variables', () => {
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
