import { describe, it, expect } from 'vitest';

/**
 * Exercise 117: Binary Search
 *
 * Binary Search is an efficient algorithm for finding an item
 * in a SORTED array by repeatedly dividing the search interval in half.
 *
 * Algorithm:
 * 1. Compare target with middle element
 * 2. If equal, return index
 * 3. If target < middle, search left half
 * 4. If target > middle, search right half
 * 5. Repeat until found or interval is empty
 *
 * Time Complexity: O(log n)
 * Space Complexity: O(1) for iterative, O(log n) for recursive
 *
 * IMPORTANT: Array must be sorted!
 *
 * Task: Implement binary search (iterative)
 */

// TODO: Implement binary search
// Return index if found, -1 if not found
export function binarySearch(arr, target) {
  // Your code here
}

// Tests
describe('Exercise 117: Binary Search', () => {
  it('should find element in sorted array', () => {
    const arr = [1, 3, 5, 7, 9, 11, 13, 15];

    expect(binarySearch(arr, 7)).toBe(3);
    expect(binarySearch(arr, 1)).toBe(0);
    expect(binarySearch(arr, 15)).toBe(7);
  });

  it('should return -1 if element not found', () => {
    const arr = [1, 3, 5, 7, 9];

    expect(binarySearch(arr, 4)).toBe(-1);
    expect(binarySearch(arr, 10)).toBe(-1);
    expect(binarySearch(arr, 0)).toBe(-1);
  });

  it('should work with single element', () => {
    expect(binarySearch([5], 5)).toBe(0);
    expect(binarySearch([5], 3)).toBe(-1);
  });

  it('should work with empty array', () => {
    expect(binarySearch([], 5)).toBe(-1);
  });

  it('should work with large array', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i * 2);

    expect(binarySearch(arr, 500)).toBe(250);
    expect(binarySearch(arr, 999)).toBe(-1);
  });
});
