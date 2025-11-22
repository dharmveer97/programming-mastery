import { describe, it, expect } from 'vitest';

/**
 * Exercise 94: Stack
 *
 * A Stack is a LIFO (Last In, First Out) data structure.
 * Think of a stack of plates - you add and remove from the top.
 *
 * Operations:
 * - push(value) - Add to top
 * - pop() - Remove from top
 * - peek() - View top without removing
 * - isEmpty() - Check if empty
 *
 * Use Cases:
 * - Function call stack
 * - Undo/Redo functionality
 * - Browser history
 * - Expression evaluation
 *
 * Task: Implement a Stack using an array
 */

// TODO: Implement Stack class
export class Stack {
  constructor() {
    // Your code here
  }

  // TODO: Add element to top
  push(value) {
    // Your code here
  }

  // TODO: Remove and return top element
  pop() {
    // Your code here
  }

  // TODO: Return top element without removing
  peek() {
    // Your code here
  }

  // TODO: Check if stack is empty
  isEmpty() {
    // Your code here
  }

  // TODO: Return stack size
  size() {
    // Your code here
  }
}

// Tests
describe('Exercise 94: Stack', () => {
  it('should create empty stack', () => {
    const stack = new Stack();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
  });

  it('should push elements', () => {
    const stack = new Stack();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    expect(stack.size()).toBe(3);
    expect(stack.isEmpty()).toBe(false);
  });

  it('should pop elements (LIFO)', () => {
    const stack = new Stack();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.isEmpty()).toBe(true);
  });

  it('should peek at top element', () => {
    const stack = new Stack();
    stack.push(1);
    stack.push(2);

    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2); // Size unchanged
  });

  it('should handle pop on empty stack', () => {
    const stack = new Stack();
    expect(stack.pop()).toBe(undefined);
  });
});
