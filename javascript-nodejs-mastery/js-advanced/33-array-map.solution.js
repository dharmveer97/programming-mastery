import { describe, it, expect } from 'vitest';

/**
 * Exercise 33: Array.map() - SOLUTION
 */

export function doubleNumbers(numbers) {
  return numbers.map(num => num * 2);
}

export function getUserNames(users) {
  return users.map(user => user.name);
}

export function formatPrices(prices) {
  return prices.map(price => `$${price}`);
}

export function getFullNames(people) {
  return people.map(person => `${person.first} ${person.last}`);
}

export function squareNumbers(numbers) {
  return numbers.map(num => num * num);
  // Alternative: return numbers.map(num => num ** 2);
}

// Tests
describe('Exercise 33: Array.map() - Solution', () => {
  it('should double all numbers', () => {
    expect(doubleNumbers([1, 2, 3])).toEqual([2, 4, 6]);
    expect(doubleNumbers([5, 10, 15])).toEqual([10, 20, 30]);
  });

  it('should extract user names', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ];
    expect(getUserNames(users)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('should format prices with $ symbol', () => {
    expect(formatPrices([10, 20, 30])).toEqual(['$10', '$20', '$30']);
    expect(formatPrices([99, 149, 249])).toEqual(['$99', '$149', '$249']);
  });

  it('should create full names', () => {
    const people = [
      { first: 'John', last: 'Doe' },
      { first: 'Jane', last: 'Smith' }
    ];
    expect(getFullNames(people)).toEqual(['John Doe', 'Jane Smith']);
  });

  it('should square all numbers', () => {
    expect(squareNumbers([2, 3, 4])).toEqual([4, 9, 16]);
    expect(squareNumbers([5, 10])).toEqual([25, 100]);
  });
});
