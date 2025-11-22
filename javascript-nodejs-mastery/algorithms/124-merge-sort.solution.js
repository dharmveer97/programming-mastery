import { describe, it, expect } from 'vitest';

/**
 * Exercise 124: Merge Sort - SOLUTION
 */

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // Compare elements and merge
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // Add remaining elements
  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}

export function mergeSort(arr) {
  // Base case: array with 0 or 1 element is already sorted
  if (arr.length <= 1) {
    return arr;
  }

  // Divide array into halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // Recursively sort halves and merge
  return merge(mergeSort(left), mergeSort(right));
}

// Tests
describe('Exercise 124: Merge Sort - Solution', () => {
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
