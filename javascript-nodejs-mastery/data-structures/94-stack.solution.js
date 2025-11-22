import { describe, it, expect } from 'vitest';

/**
 * Exercise 94: Stack - SOLUTION
 */

export class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Tests
describe('Exercise 94: Stack - Solution', () => {
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
    expect(stack.size()).toBe(2);
  });

  it('should handle pop on empty stack', () => {
    const stack = new Stack();
    expect(stack.pop()).toBe(undefined);
  });
});
