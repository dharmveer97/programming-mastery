import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'events';

/**
 * Exercise 107: Events Module (EventEmitter) - SOLUTION
 */

export function createGreeter() {
  const emitter = new EventEmitter();

  emitter.greet = function(name) {
    this.emit('greet', name);
  };

  return emitter;
}

export function createCounter() {
  const emitter = new EventEmitter();
  let count = 0;

  emitter.increment = function() {
    count++;
    this.emit('increment', count);
  };

  emitter.decrement = function() {
    count--;
    this.emit('decrement', count);
    if (count === 0) {
      this.emit('zero');
    }
  };

  emitter.getCount = function() {
    return count;
  };

  return emitter;
}

export class UserManager extends EventEmitter {
  constructor() {
    super();
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
    this.emit('userAdded', user);
  }

  removeUser(userId) {
    this.users = this.users.filter(u => u.id !== userId);
    this.emit('userRemoved', userId);
  }
}

// Tests
describe('Exercise 107: EventEmitter - Solution', () => {
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
