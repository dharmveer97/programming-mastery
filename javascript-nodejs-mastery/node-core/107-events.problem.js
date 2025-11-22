import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'events';

/**
 * Exercise 107: Events Module (EventEmitter)
 *
 * Node.js has a built-in events module for event-driven programming.
 * EventEmitter allows objects to emit events and listen for them.
 *
 * Key methods:
 * - on(event, listener) - adds listener for event
 * - emit(event, ...args) - triggers event
 * - once(event, listener) - listener runs only once
 * - removeListener(event, listener) - removes listener
 *
 * Task: Work with EventEmitter
 */

// TODO: Create a simple event emitter that emits 'greet' event
export function createGreeter() {
  const emitter = new EventEmitter();

  emitter.greet = function(name) {
    // Emit 'greet' event with name
    // Your code here
  };

  return emitter;
}

// TODO: Create a counter that emits events
// Emit 'increment' when count increases
// Emit 'decrement' when count decreases
// Emit 'zero' when count reaches 0
export function createCounter() {
  const emitter = new EventEmitter();
  let count = 0;

  emitter.increment = function() {
    // Your code here
  };

  emitter.decrement = function() {
    // Your code here
  };

  emitter.getCount = function() {
    return count;
  };

  return emitter;
}

// TODO: Create a user manager that emits events
// Emit 'userAdded' with user data when user is added
// Emit 'userRemoved' with userId when user is removed
export class UserManager extends EventEmitter {
  constructor() {
    super();
    this.users = [];
  }

  addUser(user) {
    // Your code here
  }

  removeUser(userId) {
    // Your code here
  }
}

// Tests
describe('Exercise 107: EventEmitter', () => {
  it('should emit greet event', () => {
    const greeter = createGreeter();
    let receivedName;

    greeter.on('greet', (name) => {
      receivedName = name;
    });

    greeter.greet('Alice');
    expect(receivedName).toBe('Alice');
  });

  it('should emit counter events', () => {
    const counter = createCounter();
    const events = [];

    counter.on('increment', () => events.push('increment'));
    counter.on('decrement', () => events.push('decrement'));
    counter.on('zero', () => events.push('zero'));

    counter.increment();
    counter.increment();
    counter.decrement();
    counter.decrement();

    expect(events).toEqual(['increment', 'increment', 'decrement', 'zero']);
    expect(counter.getCount()).toBe(0);
  });

  it('should emit user management events', () => {
    const manager = new UserManager();
    const addedUsers = [];
    const removedIds = [];

    manager.on('userAdded', (user) => addedUsers.push(user));
    manager.on('userRemoved', (id) => removedIds.push(id));

    manager.addUser({ id: 1, name: 'Alice' });
    manager.addUser({ id: 2, name: 'Bob' });
    manager.removeUser(1);

    expect(addedUsers).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
    expect(removedIds).toEqual([1]);
  });

  it('should use once() for one-time listener', () => {
    const emitter = new EventEmitter();
    let callCount = 0;

    emitter.once('test', () => {
      callCount++;
    });

    emitter.emit('test');
    emitter.emit('test');
    emitter.emit('test');

    expect(callCount).toBe(1);
  });
});
