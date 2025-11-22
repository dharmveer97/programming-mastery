import { describe, it, expect } from 'vitest';

/**
 * Exercise 124: Merge Sort
 *
 * Merge Sort is a divide-and-conquer algorithm that:
 * 1. Divides array into halves
 * 2. Recursively sorts each half
 * 3. Merges sorted halves
 *
 * Time Complexity: O(n log n) - best, average, worst
 * Space Complexity: O(n)
 *
 * Advantages:
 * - Stable sort (preserves order of equal elements)
 * - Predictable performance
 * - Good for large datasets
 *
 * Task: Implement merge sort
 */

// TODO: Implement merge function
// Merges two sorted arrays into one sorted array
function merge(left, right) {
  // Your code here
}

// TODO: Implement merge sort
export function mergeSort(arr) {
  // Your code here
}

// Tests
describe('Exercise 124: Merge Sort', () => {
  it('should sort empty array', () => {
    expect(mergeSort([])).toEqual([]);
  });

  it('should sort single element', () => {
    expect(mergeSort([5])).toEqual([5]);
  });

  it('should sort unsorted array', () => {
    expect(mergeSort([5, 2, 8, 1, 9])).toEqual([1, 2, 5, 8, 9]);
    expect(mergeSort([64, 34, 25, 12, 22, 11, 90])).toEqual([11, 12, 22, 25, 34, 64, 90]);
  });

  it('should handle already sorted array', () => {
    expect(mergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle reverse sorted array', () => {
    expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle duplicates', () => {
    expect(mergeSort([3, 1, 4, 1, 5, 9, 2, 6, 5])).toEqual([1, 1, 2, 3, 4, 5, 5, 6, 9]);
  });

  it('should handle negative numbers', () => {
    expect(mergeSort([3, -1, 0, -5, 2])).toEqual([-5, -1, 0, 2, 3]);
  });
});
