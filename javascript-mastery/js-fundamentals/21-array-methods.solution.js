import { describe, it, expect } from 'vitest';

/**
 * Exercise 21: Array Methods - SOLUTION
 */

export function addToEnd(arr, item) {
  arr.push(item);
  // push() modifies the original array and returns new length
}

export function removeFromEnd(arr) {
  return arr.pop();
  // pop() removes and returns the last element
}

export function removeFromStart(arr) {
  return arr.shift();
  // shift() removes and returns the first element
}

export function addToStart(arr, item) {
  arr.unshift(item);
  // unshift() adds to beginning and returns new length
}

export function getArrayLength(arr) {
  return arr.length;
}

export function isArrayEmpty(arr) {
  return arr.length === 0;
  // Alternative: return !arr.length;
}

// Tests
describe('Exercise 21: Array Methods - Solution', () => {
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
