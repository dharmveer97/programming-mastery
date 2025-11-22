import { describe, it, expect } from 'vitest';

/**
 * Exercise 12: Functions (declaration vs expression)
 *
 * Learn different ways to define functions:
 * - Function declaration
 * - Function expression
 * - Arrow functions
 *
 * Task: Implement functions in different styles
 */

// TODO: Create a function declaration that adds two numbers
// function add(a, b) { ... }


// TODO: Create a function expression that multiplies two numbers
// const multiply = function(a, b) { ... }


// TODO: Create an arrow function that divides two numbers
// const divide = (a, b) => { ... }


// TODO: Create an arrow function with implicit return
// that returns the square of a number
// const square = n => ...


// TODO: Create a function that returns a greeting message
// "Hello, [name]! Welcome to JavaScript."
export function greet(name) {
  // Your code here
}

// Tests
describe('Exercise 12: Functions', () => {
  it('should add two numbers using function declaration', () => {
    expect(add(5, 3)).toBe(8);
    expect(add(10, 20)).toBe(30);
  });

  it('should multiply two numbers using function expression', () => {
    expect(multiply(4, 5)).toBe(20);
    expect(multiply(7, 3)).toBe(21);
  });

  it('should divide two numbers using arrow function', () => {
    expect(divide(10, 2)).toBe(5);
    expect(divide(20, 4)).toBe(5);
  });

  it('should square a number using arrow function with implicit return', () => {
    expect(square(5)).toBe(25);
    expect(square(10)).toBe(100);
  });

  it('should create greeting message', () => {
    expect(greet('Alice')).toBe('Hello, Alice! Welcome to JavaScript.');
    expect(greet('Bob')).toBe('Hello, Bob! Welcome to JavaScript.');
  });
});
