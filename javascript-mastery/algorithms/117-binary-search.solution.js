import { describe, it, expect } from 'vitest';

/**
 * Exercise 117: Binary Search - SOLUTION
 */

// Iterative approach
export function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    }

    if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return -1; // Not found
}

// Recursive approach (alternative)
export function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// Tests
describe('Exercise 117: Binary Search - Solution', () => {
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
