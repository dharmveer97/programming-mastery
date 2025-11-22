import { describe, it, expect } from 'vitest';

/**
 * Exercise 34: Array.filter()
 *
 * The filter() method creates a NEW array with elements
 * that pass a test (return true from callback).
 *
 * Syntax: array.filter((element, index, array) => { return boolean })
 *
 * Key points:
 * - Returns a NEW array (doesn't modify original)
 * - New array contains only elements that passed the test
 * - Use when you want to select specific elements
 *
 * Task: Use filter() to select elements based on conditions
 */

// TODO: Get only even numbers from array
export function getEvenNumbers(numbers) {
  // Your code here
}

// TODO: Get only numbers greater than 10
export function getNumbersGreaterThan10(numbers) {
  // Your code here
}

// TODO: Get only adult users (age >= 18)
// Input: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 15 }]
// Output: [{ name: 'Alice', age: 25 }]
export function getAdults(users) {
  // Your code here
}

// TODO: Get only strings longer than N characters
export function getLongStrings(strings, minLength) {
  // Your code here
}

// TODO: Get only active users (isActive: true)
export function getActiveUsers(users) {
  // Your code here
}

// Tests
describe('Exercise 34: Array.filter()', () => {
  it('should filter even numbers', () => {
    expect(getEvenNumbers([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
    expect(getEvenNumbers([10, 15, 20, 25])).toEqual([10, 20]);
  });

  it('should filter numbers greater than 10', () => {
    expect(getNumbersGreaterThan10([5, 12, 8, 20, 3])).toEqual([12, 20]);
    expect(getNumbersGreaterThan10([1, 2, 3])).toEqual([]);
  });

  it('should filter adult users', () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 15 },
      { name: 'Charlie', age: 30 },
      { name: 'Dave', age: 17 }
    ];
    const adults = getAdults(users);
    expect(adults).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Charlie', age: 30 }
    ]);
  });

  it('should filter long strings', () => {
    const strings = ['hi', 'hello', 'hey', 'greetings'];
    expect(getLongStrings(strings, 5)).toEqual(['greetings']);
    expect(getLongStrings(strings, 3)).toEqual(['hello', 'greetings']);
  });

  it('should filter active users', () => {
    const users = [
      { id: 1, name: 'Alice', isActive: true },
      { id: 2, name: 'Bob', isActive: false },
      { id: 3, name: 'Charlie', isActive: true }
    ];
    const active = getActiveUsers(users);
    expect(active).toEqual([
      { id: 1, name: 'Alice', isActive: true },
      { id: 3, name: 'Charlie', isActive: true }
    ]);
  });
});
