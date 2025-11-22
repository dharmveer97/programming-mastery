import { describe, it, expect } from 'vitest';

/**
 * Exercise 03: String Methods
 *
 * Master essential string methods:
 * - toUpperCase(), toLowerCase()
 * - slice(), substring()
 * - indexOf(), includes()
 * - split(), trim()
 * - replace(), replaceAll()
 *
 * Task: Implement functions using string methods
 */

// TODO: Convert string to uppercase
export function makeUpperCase(str) {
  // Your code here
}

// TODO: Get the first N characters from a string
export function getFirstNChars(str, n) {
  // Your code here
}

// TODO: Check if string contains a substring (case-insensitive)
export function containsWord(str, word) {
  // Your code here
}

// TODO: Remove whitespace from both ends
export function trimString(str) {
  // Your code here
}

// TODO: Replace all spaces with dashes
export function spacesToDashes(str) {
  // Your code here
}

// TODO: Split full name into first and last name
// Return object: { firstName: '...', lastName: '...' }
export function splitName(fullName) {
  // Your code here
}

// Tests
describe('Exercise 03: String Methods', () => {
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
