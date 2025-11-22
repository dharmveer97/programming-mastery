import { describe, it, expect } from 'vitest';

/**
 * Exercise 12: Functions - SOLUTION
 */

// Function declaration - hoisted, can be called before definition
export function add(a, b) {
  return a + b;
}

// Function expression - not hoisted, must be defined before use
export const multiply = function(a, b) {
  return a * b;
};

// Arrow function with block body
export const divide = (a, b) => {
  return a / b;
};

// Arrow function with implicit return (no curly braces)
export const square = n => n * n;

// Function with template literal
export function greet(name) {
  return `Hello, ${name}! Welcome to JavaScript.`;
}

// Tests
describe('Exercise 12: Functions - Solution', () => {
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
