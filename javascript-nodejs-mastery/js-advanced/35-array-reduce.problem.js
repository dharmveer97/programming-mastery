import { describe, it, expect } from 'vitest';

/**
 * Exercise 35: Array.reduce()
 *
 * The reduce() method reduces an array to a SINGLE VALUE
 * by applying a function to each element (with an accumulator).
 *
 * Syntax: array.reduce((accumulator, current, index, array) => {
 *   return newAccumulatorValue
 * }, initialValue)
 *
 * Key points:
 * - Returns a single value (number, string, object, etc.)
 * - Accumulator stores the result between iterations
 * - Use when you want to combine all elements into one value
 *
 * Task: Use reduce() to aggregate array values
 */

// TODO: Sum all numbers in array
export function sum(numbers) {
  // Your code here
}

// TODO: Find the maximum number in array
export function findMax(numbers) {
  // Your code here
}

// TODO: Count occurrences of each item
// Input: ['apple', 'banana', 'apple', 'orange', 'banana', 'apple']
// Output: { apple: 3, banana: 2, orange: 1 }
export function countOccurrences(items) {
  // Your code here
}

// TODO: Flatten an array of arrays
// Input: [[1, 2], [3, 4], [5]]
// Output: [1, 2, 3, 4, 5]
export function flattenArray(arrays) {
  // Your code here
}

// TODO: Group users by age
// Input: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }, { name: 'Charlie', age: 30 }]
// Output: { 25: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }], 30: [{ name: 'Charlie', age: 30 }] }
export function groupByAge(users) {
  // Your code here
}

// Tests
describe('Exercise 35: Array.reduce()', () => {
  it('should sum all numbers', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
    expect(sum([10, 20, 30])).toBe(60);
    expect(sum([5])).toBe(5);
  });

  it('should find maximum number', () => {
    expect(findMax([1, 5, 3, 9, 2])).toBe(9);
    expect(findMax([10, 20, 15])).toBe(20);
    expect(findMax([100])).toBe(100);
  });

  it('should count occurrences', () => {
    const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
    expect(countOccurrences(fruits)).toEqual({
      apple: 3,
      banana: 2,
      orange: 1
    });
  });

  it('should flatten array of arrays', () => {
    expect(flattenArray([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
    expect(flattenArray([[10], [20, 30], [40, 50, 60]])).toEqual([10, 20, 30, 40, 50, 60]);
  });

  it('should group users by age', () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 30 }
    ];
    expect(groupByAge(users)).toEqual({
      25: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }],
      30: [{ name: 'Charlie', age: 30 }]
    });
  });
});
