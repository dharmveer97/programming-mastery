import { describe, it, expect } from 'vitest';

/**
 * Exercise 34: Array.filter() - SOLUTION
 */

export function getEvenNumbers(numbers) {
  return numbers.filter(num => num % 2 === 0);
}

export function getNumbersGreaterThan10(numbers) {
  return numbers.filter(num => num > 10);
}

export function getAdults(users) {
  return users.filter(user => user.age >= 18);
}

export function getLongStrings(strings, minLength) {
  return strings.filter(str => str.length > minLength);
}

export function getActiveUsers(users) {
  return users.filter(user => user.isActive);
  // Alternative: return users.filter(user => user.isActive === true);
}

// Tests
describe('Exercise 34: Array.filter() - Solution', () => {
  it('should filter even numbers', () => {
    expect(getEvenNumbers([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
    expect(getEvenNumbers([10, 15, 20, 25])).toEqual([10, 20]);
  });

  it('should filter numbers greater than 10', () => {
    expect(getNumbersGreaterThan10([5, 12, 8, 20, 3])).toEqual([12, 20]);
    expect(getNumbersGreaterThan10([1, 2, 3])).toEqual([]);
  });

  it('should filter adult users', () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 15 },
      { name: 'Charlie', age: 30 },
      { name: 'Dave', age: 17 }
    ];
    const adults = getAdults(users);
    expect(adults).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Charlie', age: 30 }
    ]);
  });

  it('should filter long strings', () => {
    const strings = ['hi', 'hello', 'hey', 'greetings'];
    expect(getLongStrings(strings, 5)).toEqual(['greetings']);
    expect(getLongStrings(strings, 3)).toEqual(['hello', 'greetings']);
  });

  it('should filter active users', () => {
    const users = [
      { id: 1, name: 'Alice', isActive: true },
      { id: 2, name: 'Bob', isActive: false },
      { id: 3, name: 'Charlie', isActive: true }
    ];
    const active = getActiveUsers(users);
    expect(active).toEqual([
      { id: 1, name: 'Alice', isActive: true },
      { id: 3, name: 'Charlie', isActive: true }
    ]);
  });
});
