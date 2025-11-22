import { describe, it, expect } from 'vitest';

/**
 * Exercise 21: Array Methods (push, pop, shift, unshift)
 *
 * Learn basic array manipulation methods:
 * - push() - adds to end
 * - pop() - removes from end
 * - shift() - removes from beginning
 * - unshift() - adds to beginning
 * - length - array size
 *
 * Task: Implement functions using array methods
 */

// TODO: Add item to the end of array
export function addToEnd(arr, item) {
  // Your code here
}

// TODO: Remove and return the last item from array
export function removeFromEnd(arr) {
  // Your code here
}

// TODO: Remove and return the first item from array
export function removeFromStart(arr) {
  // Your code here
}

// TODO: Add item to the beginning of array
export function addToStart(arr, item) {
  // Your code here
}

// TODO: Get the length of array
export function getArrayLength(arr) {
  // Your code here
}

// TODO: Check if array is empty
export function isArrayEmpty(arr) {
  // Your code here
}

// Tests
describe('Exercise 21: Array Methods', () => {
  it('should add item to end', () => {
    const arr = [1, 2, 3];
    addToEnd(arr, 4);
    expect(arr).toEqual([1, 2, 3, 4]);
  });

  it('should remove item from end', () => {
    const arr = [1, 2, 3];
    const removed = removeFromEnd(arr);
    expect(removed).toBe(3);
    expect(arr).toEqual([1, 2]);
  });

  it('should remove item from start', () => {
    const arr = [1, 2, 3];
    const removed = removeFromStart(arr);
    expect(removed).toBe(1);
    expect(arr).toEqual([2, 3]);
  });

  it('should add item to start', () => {
    const arr = [2, 3];
    addToStart(arr, 1);
    expect(arr).toEqual([1, 2, 3]);
  });

  it('should get array length', () => {
    expect(getArrayLength([1, 2, 3])).toBe(3);
    expect(getArrayLength([])).toBe(0);
  });

  it('should check if array is empty', () => {
    expect(isArrayEmpty([])).toBe(true);
    expect(isArrayEmpty([1, 2])).toBe(false);
  });
});
