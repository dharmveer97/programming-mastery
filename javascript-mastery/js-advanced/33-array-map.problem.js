import { describe, it, expect } from 'vitest';

/**
 * Exercise 33: Array.map()
 *
 * The map() method creates a NEW array by applying a function
 * to each element of the original array.
 *
 * Syntax: array.map((element, index, array) => { return newValue })
 *
 * Key points:
 * - Returns a NEW array (doesn't modify original)
 * - Always returns array of same length
 * - Use when you want to transform each element
 *
 * Task: Use map() to transform arrays
 */

// TODO: Double each number in the array
export function doubleNumbers(numbers) {
  // Your code here
}

// TODO: Get all user names from array of user objects
// Input: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
// Output: ['Alice', 'Bob']
export function getUserNames(users) {
  // Your code here
}

// TODO: Convert prices to strings with $ symbol
// Input: [10, 20, 30]
// Output: ['$10', '$20', '$30']
export function formatPrices(prices) {
  // Your code here
}

// TODO: Get array of full names from first and last names
// Input: [{ first: 'John', last: 'Doe' }, { first: 'Jane', last: 'Smith' }]
// Output: ['John Doe', 'Jane Smith']
export function getFullNames(people) {
  // Your code here
}

// TODO: Square all numbers in array
export function squareNumbers(numbers) {
  // Your code here
}

// Tests
describe('Exercise 33: Array.map()', () => {
  it('should double all numbers', () => {
    expect(doubleNumbers([1, 2, 3])).toEqual([2, 4, 6]);
    expect(doubleNumbers([5, 10, 15])).toEqual([10, 20, 30]);
  });

  it('should extract user names', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];
    expect(getUserNames(users)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('should format prices with $ symbol', () => {
    expect(formatPrices([10, 20, 30])).toEqual(['$10', '$20', '$30']);
    expect(formatPrices([99, 149, 249])).toEqual(['$99', '$149', '$249']);
  });

  it('should create full names', () => {
    const people = [
      { first: 'John', last: 'Doe' },
      { first: 'Jane', last: 'Smith' }
    ];
    expect(getFullNames(people)).toEqual(['John Doe', 'Jane Smith']);
  });

  it('should square all numbers', () => {
    expect(squareNumbers([2, 3, 4])).toEqual([4, 9, 16]);
    expect(squareNumbers([5, 10])).toEqual([25, 100]);
  });
});
