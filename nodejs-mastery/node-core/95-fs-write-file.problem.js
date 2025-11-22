import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 95: File System - Write Files
 *
 * The fs module provides methods to write data to files.
 *
 * Key methods:
 * - fs.writeFileSync(path, data) - writes file synchronously (replaces content)
 * - fs.writeFile(path, data, callback) - writes file asynchronously
 * - fs.appendFileSync(path, data) - appends to file synchronously
 * - fs.appendFile(path, data, callback) - appends to file asynchronously
 *
 * Task: Write and append data to files using both sync and async methods
 */

const TEST_DIR = path.join(process.cwd(), 'test-files-write');

// Setup: Create test directory
beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
});

// Cleanup: Remove test files
afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    const files = fs.readdirSync(TEST_DIR);
    files.forEach(file => {
      fs.unlinkSync(path.join(TEST_DIR, file));
    });
    fs.rmdirSync(TEST_DIR);
  }
});

// TODO: Write content to file synchronously
export function writeFileSync(filePath, content) {
  // Your code here
  // Hint: Use fs.writeFileSync
}

// TODO: Write content to file asynchronously
export function writeFileAsync(filePath, content) {
  // Your code here
  // Hint: Return a Promise, use fs.writeFile
  // Remember to handle the callback
}

// TODO: Append content to existing file synchronously
export function appendToFileSync(filePath, content) {
  // Your code here
  // Hint: Use fs.appendFileSync
}

// TODO: Append content to file asynchronously
export function appendToFileAsync(filePath, content) {
  // Your code here
  // Hint: Return a Promise, use fs.appendFile
}

// TODO: Write JSON object to file
export function writeJSON(filePath, data) {
  // Your code here
  // Hint: Convert object to JSON string with JSON.stringify
}

// TODO: Create file with specific encoding
export function writeWithEncoding(filePath, content, encoding = 'utf-8') {
  // Your code here
  // Hint: Pass encoding as third parameter to writeFileSync
}

// Tests
describe('Exercise 95: fs.writeFile', () => {
  it('should write file synchronously', () => {
    const filePath = path.join(TEST_DIR, 'sync.txt');
    writeFileSync(filePath, 'Hello World');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Hello World');
  });

  it('should write file asynchronously', async () => {
    const filePath = path.join(TEST_DIR, 'async.txt');
    await writeFileAsync(filePath, 'Async Content');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Async Content');
  });

  it('should append to file synchronously', () => {
    const filePath = path.join(TEST_DIR, 'append-sync.txt');
    fs.writeFileSync(filePath, 'Line 1\n');
    appendToFileSync(filePath, 'Line 2\n');
    appendToFileSync(filePath, 'Line 3');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Line 1\nLine 2\nLine 3');
  });

  it('should append to file asynchronously', async () => {
    const filePath = path.join(TEST_DIR, 'append-async.txt');
    fs.writeFileSync(filePath, 'Start\n');
    await appendToFileAsync(filePath, 'Middle\n');
    await appendToFileAsync(filePath, 'End');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Start\nMiddle\nEnd');
  });

  it('should write JSON to file', () => {
    const filePath = path.join(TEST_DIR, 'data.json');
    const data = { name: 'John', age: 30, city: 'New York' };

    writeJSON(filePath, data);

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed).toEqual(data);
  });

  it('should write file with specific encoding', () => {
    const filePath = path.join(TEST_DIR, 'encoded.txt');
    writeWithEncoding(filePath, 'Hello World', 'utf-8');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Hello World');
  });

  it('should overwrite existing file', () => {
    const filePath = path.join(TEST_DIR, 'overwrite.txt');
    writeFileSync(filePath, 'First content');
    writeFileSync(filePath, 'Second content');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Second content');
  });

  it('should handle multiple async writes', async () => {
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];

    await Promise.all(
      files.map((file, index) =>
        writeFileAsync(path.join(TEST_DIR, file), `Content ${index + 1}`)
      )
    );

    files.forEach((file, index) => {
      const content = fs.readFileSync(path.join(TEST_DIR, file), 'utf-8');
      expect(content).toBe(`Content ${index + 1}`);
    });
  });
});
