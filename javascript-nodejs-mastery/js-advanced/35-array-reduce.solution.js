import { describe, it, expect } from 'vitest';

/**
 * Exercise 35: Array.reduce() - SOLUTION
 */

export function sum(numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

export function findMax(numbers) {
  return numbers.reduce((max, num) => (num > max ? num : max), numbers[0]);
  // Alternative: return Math.max(...numbers);
}

export function countOccurrences(items) {
  return items.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {});
}

export function flattenArray(arrays) {
  return arrays.reduce((flat, arr) => flat.concat(arr), []);
  // Alternative: return arrays.flat();
}

export function groupByAge(users) {
  return users.reduce((groups, user) => {
    const age = user.age;
    if (!groups[age]) {
      groups[age] = [];
    }
    groups[age].push(user);
    return groups;
  }, {});
}

// Tests
describe('Exercise 35: Array.reduce() - Solution', () => {
  it('should sum all numbers', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
    expect(sum([10, 20, 30])).toBe(60);
    expect(sum([5])).toBe(5);
  });

  it('should find maximum number', () => {
    expect(findMax([1, 5, 3, 9, 2])).toBe(9);
    expect(findMax([10, 20, 15])).toBe(20);
    expect(findMax([100])).toBe(100);
  });

  it('should count occurrences', () => {
    const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
    expect(countOccurrences(fruits)).toEqual({
      apple: 3,
      banana: 2,
      orange: 1
    });
  });

  it('should flatten array of arrays', () => {
    expect(flattenArray([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
    expect(flattenArray([[10], [20, 30], [40, 50, 60]])).toEqual([10, 20, 30, 40, 50, 60]);
  });

  it('should group users by age', () => {
    const users = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 30 }
    ];
    expect(groupByAge(users)).toEqual({
      25: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }],
      30: [{ name: 'Charlie', age: 30 }]
    });
  });
});
