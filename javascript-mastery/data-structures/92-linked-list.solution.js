import { describe, it, expect } from 'vitest';

/**
 * Exercise 92: Linked List - SOLUTION
 */

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      // Empty list
      this.head = newNode;
      this.tail = newNode;
    } else {
      // Add to end
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return this;
  }

  prepend(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.length++;
    return this;
  }

  find(value) {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }

    return null;
  }

  delete(value) {
    if (!this.head) return null;

    // Delete head
    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return this;
    }

    // Delete middle or tail
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;

        // Update tail if needed
        if (!current.next) {
          this.tail = current;
        }

        this.length--;
        return this;
      }
      current = current.next;
    }

    return this;
  }

  toArray() {
    const result = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }
}

// Tests
describe('Exercise 92: Linked List - Solution', () => {
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
