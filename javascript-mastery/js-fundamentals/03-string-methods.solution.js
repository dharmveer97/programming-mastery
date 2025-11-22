import { describe, it, expect } from 'vitest';

/**
 * Exercise 03: String Methods - SOLUTION
 */

export function makeUpperCase(str) {
  return str.toUpperCase();
}

export function getFirstNChars(str, n) {
  return str.slice(0, n);
  // Alternative: return str.substring(0, n);
}

export function containsWord(str, word) {
  return str.toLowerCase().includes(word.toLowerCase());
}

export function trimString(str) {
  return str.trim();
}

export function spacesToDashes(str) {
  return str.replaceAll(' ', '-');
  // Alternative: return str.split(' ').join('-');
}

export function splitName(fullName) {
  const parts = fullName.split(' ');
  return {
    firstName: parts[0],
    lastName: parts[1]
  };
  // Alternative using destructuring:
  // const [firstName, lastName] = fullName.split(' ');
  // return { firstName, lastName };
}

// Tests
describe('Exercise 03: String Methods - Solution', () => {
  it('should convert to uppercase', () => {
    expect(makeUpperCase('hello')).toBe('HELLO');
    expect(makeUpperCase('JavaScript')).toBe('JAVASCRIPT');
  });

  it('should get first N characters', () => {
    expect(getFirstNChars('JavaScript', 4)).toBe('Java');
    expect(getFirstNChars('Hello World', 5)).toBe('Hello');
  });

  it('should check if string contains word (case-insensitive)', () => {
    expect(containsWord('Hello World', 'world')).toBe(true);
    expect(containsWord('JavaScript is awesome', 'SCRIPT')).toBe(true);
    expect(containsWord('Hello World', 'bye')).toBe(false);
  });

  it('should trim whitespace', () => {
    expect(trimString('  hello  ')).toBe('hello');
    expect(trimString('\n\tworld\t\n')).toBe('world');
  });

  it('should replace spaces with dashes', () => {
    expect(spacesToDashes('hello world')).toBe('hello-world');
    expect(spacesToDashes('I love JavaScript')).toBe('I-love-JavaScript');
  });

  it('should split full name', () => {
    expect(splitName('John Doe')).toEqual({ firstName: 'John', lastName: 'Doe' });
    expect(splitName('Jane Smith')).toEqual({ firstName: 'Jane', lastName: 'Smith' });
  });
});
