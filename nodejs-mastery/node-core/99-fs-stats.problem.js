import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

/**
 * Exercise 99: File System - File Stats and Metadata
 *
 * The fs module provides methods to retrieve file metadata.
 *
 * Key methods:
 * - fs.statSync(path) - gets file stats synchronously
 * - fs.stat(path, callback) - gets file stats asynchronously
 * - fs.promises.stat(path) - gets file stats with promises
 *
 * Stats object properties:
 * - stats.isFile() - checks if it's a file
 * - stats.isDirectory() - checks if it's a directory
 * - stats.size - file size in bytes
 * - stats.mtime - last modified time
 * - stats.birthtime - creation time
 *
 * Task: Get and analyze file metadata
 */

const TEST_DIR = path.join(process.cwd(), 'test-stats');

// Setup: Create test files
beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
  fs.writeFileSync(path.join(TEST_DIR, 'sample.txt'), 'Hello World!');
  fs.mkdirSync(path.join(TEST_DIR, 'subdir'), { recursive: true });
});

// Cleanup: Remove test files
afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

// TODO: Get file stats synchronously
export function getFileStats(filePath) {
  // Your code here
  // Hint: Use fs.statSync
  // Return the stats object
}

// TODO: Get file stats asynchronously with promises
export async function getFileStatsAsync(filePath) {
  // Your code here
  // Hint: Use fsPromises.stat
}

// TODO: Check if path is a file
export function isFile(filePath) {
  // Your code here
  // Hint: Use fs.statSync and check isFile()
  // Return false if path doesn't exist
}

// TODO: Get file size in bytes
export function getFileSize(filePath) {
  // Your code here
  // Hint: Use stats.size
}

// TODO: Get file size in human-readable format (KB, MB, GB)
export function getFileSizeFormatted(filePath) {
  // Your code here
  // Hint: Convert bytes to KB, MB, or GB as appropriate
  // Return string like "1.5 KB" or "2.3 MB"
}

// TODO: Get last modified time
export function getLastModified(filePath) {
  // Your code here
  // Hint: Use stats.mtime
  // Return Date object
}

// TODO: Check if file was modified after a certain date
export function wasModifiedAfter(filePath, date) {
  // Your code here
  // Hint: Compare stats.mtime with the given date
  // Return boolean
}

// TODO: Get detailed file info object
export function getFileInfo(filePath) {
  // Your code here
  // Hint: Return an object with: name, size, isFile, isDirectory, created, modified
  // Use path.basename for name
}

// Tests
describe('Exercise 99: fs.stat', () => {
  it('should get file stats synchronously', () => {
    const filePath = path.join(TEST_DIR, 'sample.txt');
    const stats = getFileStats(filePath);

    expect(stats).toBeDefined();
    expect(stats.isFile()).toBe(true);
    expect(stats.size).toBeGreaterThan(0);
  });

  it('should get file stats asynchronously', async () => {
    const filePath = path.join(TEST_DIR, 'sample.txt');
    const stats = await getFileStatsAsync(filePath);

    expect(stats).toBeDefined();
    expect(stats.isFile()).toBe(true);
  });

  it('should check if path is a file', () => {
    const filePath = path.join(TEST_DIR, 'sample.txt');
    const dirPath = path.join(TEST_DIR, 'subdir');

    expect(isFile(filePath)).toBe(true);
    expect(isFile(dirPath)).toBe(false);
    expect(isFile('/nonexistent')).toBe(false);
  });

  it('should get file size in bytes', () => {
    const filePath = path.join(TEST_DIR, 'sample.txt');
    const size = getFileSize(filePath);

    expect(size).toBe(12); // "Hello World!" is 12 bytes
  });

  it('should get file size in human-readable format', () => {
    const smallFile = path.join(TEST_DIR, 'small.txt');
    const mediumFile = path.join(TEST_DIR, 'medium.txt');

    fs.writeFileSync(smallFile, 'a'.repeat(500)); // 500 bytes
    fs.writeFileSync(mediumFile, 'a'.repeat(5000)); // 5000 bytes

    const smallSize = getFileSizeFormatted(smallFile);
    const mediumSize = getFileSizeFormatted(mediumFile);

    expect(smallSize).toContain('bytes');
    expect(mediumSize).toContain('KB');
  });

  it('should get last modified time', () => {
    const filePath = path.join(TEST_DIR, 'sample.txt');
    const mtime = getLastModified(filePath);

    expect(mtime).toBeInstanceOf(Date);
    expect(mtime.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('should check if file was modified after date', () => {
    const filePath = path.join(TEST_DIR, 'sample.txt');
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    expect(wasModifiedAfter(filePath, yesterday)).toBe(true);
    expect(wasModifiedAfter(filePath, tomorrow)).toBe(false);
  });

  it('should get detailed file info', () => {
    const filePath = path.join(TEST_DIR, 'sample.txt');
    const info = getFileInfo(filePath);

    expect(info).toHaveProperty('name', 'sample.txt');
    expect(info).toHaveProperty('size', 12);
    expect(info).toHaveProperty('isFile', true);
    expect(info).toHaveProperty('isDirectory', false);
    expect(info).toHaveProperty('created');
    expect(info).toHaveProperty('modified');
    expect(info.created).toBeInstanceOf(Date);
    expect(info.modified).toBeInstanceOf(Date);
  });

  it('should handle large file sizes', () => {
    const largeFile = path.join(TEST_DIR, 'large.txt');
    // Create 2MB file
    fs.writeFileSync(largeFile, 'a'.repeat(2 * 1024 * 1024));

    const formatted = getFileSizeFormatted(largeFile);
    expect(formatted).toContain('MB');
  });
});
