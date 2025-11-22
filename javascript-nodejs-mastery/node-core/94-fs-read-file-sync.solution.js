import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 94: File System - Read File (Synchronous) - SOLUTION
 */

const TEST_DIR = path.join(process.cwd(), 'test-files');
const TEST_FILE = path.join(TEST_DIR, 'sample.txt');

beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
  fs.writeFileSync(TEST_FILE, 'Hello from file!');
});

afterAll(() => {
  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }
  if (fs.existsSync(TEST_DIR)) {
    fs.rmdirSync(TEST_DIR);
  }
});

export function readFileContent(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

export function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

export function countWords(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split(' ').length;
}

// Tests
describe('Exercise 94: fs.readFileSync - Solution', () => {
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
