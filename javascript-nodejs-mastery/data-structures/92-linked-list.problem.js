import { describe, it, expect } from 'vitest';

/**
 * Exercise 92: Linked List
 *
 * A Linked List is a linear data structure where elements (nodes)
 * are stored in separate objects, each pointing to the next node.
 *
 * Structure:
 * Head -> [1 | next] -> [2 | next] -> [3 | null]
 *
 * Operations:
 * - append(value) - Add to end
 * - prepend(value) - Add to beginning
 * - find(value) - Search for value
 * - delete(value) - Remove node
 *
 * Task: Implement a Singly Linked List
 */

// Node class (provided)
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// TODO: Implement LinkedList class
export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // TODO: Add node to the end
  append(value) {
    // Your code here
  }

  // TODO: Add node to the beginning
  prepend(value) {
    // Your code here
  }

  // TODO: Find node with value
  find(value) {
    // Your code here
  }

  // TODO: Delete node with value
  delete(value) {
    // Your code here
  }

  // TODO: Convert to array (for testing)
  toArray() {
    // Your code here
  }
}

// Tests
describe('Exercise 92: Linked List', () => {
  it('should create empty linked list', () => {
    const list = new LinkedList();
    expect(list.head).toBe(null);
    expect(list.length).toBe(0);
  });

  it('should append nodes', () => {
    const list = new LinkedList();
    list.append(1);
    list.append(2);
    list.append(3);

    expect(list.toArray()).toEqual([1, 2, 3]);
    expect(list.length).toBe(3);
  });

  it('should prepend nodes', () => {
    const list = new LinkedList();
    list.prepend(3);
    list.prepend(2);
    list.prepend(1);

    expect(list.toArray()).toEqual([1, 2, 3]);
  });

  it('should find node by value', () => {
    const list = new LinkedList();
    list.append(1);
    list.append(2);
    list.append(3);

    const node = list.find(2);
    expect(node.value).toBe(2);
  });

  it('should delete node', () => {
    const list = new LinkedList();
    list.append(1);
    list.append(2);
    list.append(3);

    list.delete(2);
    expect(list.toArray()).toEqual([1, 3]);
    expect(list.length).toBe(2);
  });
});
