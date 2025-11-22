import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 94: File System - Read File (Synchronous)
 *
 * The fs (file system) module allows you to work with files.
 *
 * Key methods:
 * - fs.readFileSync(path, encoding) - reads file synchronously
 * - fs.writeFileSync(path, data) - writes file synchronously
 * - fs.existsSync(path) - checks if file exists
 *
 * Task: Read and process files synchronously
 */

const TEST_DIR = path.join(process.cwd(), 'test-files');
const TEST_FILE = path.join(TEST_DIR, 'sample.txt');

// Setup: Create test files
beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
  fs.writeFileSync(TEST_FILE, 'Hello from file!');
});

// Cleanup: Remove test files
afterAll(() => {
  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }
  if (fs.existsSync(TEST_DIR)) {
    fs.rmdirSync(TEST_DIR);
  }
});

// TODO: Read file content synchronously
export function readFileContent(filePath) {
  // Your code here
  // Hint: Use fs.readFileSync with 'utf-8' encoding
}

// TODO: Check if file exists
export function fileExists(filePath) {
  // Your code here
}

// TODO: Read file and return line count
export function countLines(filePath) {
  // Your code here
}

// TODO: Read file and return word count
export function countWords(filePath) {
  // Your code here
}

// Tests
describe('Exercise 94: fs.readFileSync', () => {
  it('should read file content', () => {
    const content = readFileContent(TEST_FILE);
    expect(content).toBe('Hello from file!');
  });

  it('should check if file exists', () => {
    expect(fileExists(TEST_FILE)).toBe(true);
    expect(fileExists('/nonexistent/file.txt')).toBe(false);
  });

  it('should count lines in file', () => {
    const multiLineFile = path.join(TEST_DIR, 'multiline.txt');
    fs.writeFileSync(multiLineFile, 'Line 1\nLine 2\nLine 3');

    expect(countLines(multiLineFile)).toBe(3);

    fs.unlinkSync(multiLineFile);
  });

  it('should count words in file', () => {
    const wordsFile = path.join(TEST_DIR, 'words.txt');
    fs.writeFileSync(wordsFile, 'Hello world from Node.js');

    expect(countWords(wordsFile)).toBe(4);

    fs.unlinkSync(wordsFile);
  });
});
