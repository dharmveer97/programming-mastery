import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

/**
 * Exercise 97: File System - Working with Directories
 *
 * The fs module provides methods to manage directories.
 *
 * Key methods:
 * - fs.mkdirSync(path) - creates directory synchronously
 * - fs.mkdir(path, callback) - creates directory asynchronously
 * - fs.readdirSync(path) - reads directory contents synchronously
 * - fs.readdir(path, callback) - reads directory asynchronously
 * - fs.rmdirSync(path) - removes empty directory
 * - fs.rmSync(path, { recursive: true }) - removes directory and contents
 *
 * Task: Create, read, and manage directories
 */

const TEST_DIR = path.join(process.cwd(), 'test-directories');

// Setup: Create base test directory
beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
});

// Cleanup: Remove all test directories
afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

// TODO: Create directory synchronously
export function createDirectorySync(dirPath) {
  // Your code here
  // Hint: Use fs.mkdirSync
}

// TODO: Create directory asynchronously with promises
export async function createDirectoryAsync(dirPath) {
  // Your code here
  // Hint: Use fsPromises.mkdir
}

// TODO: List all files and folders in directory
export function listDirectory(dirPath) {
  // Your code here
  // Hint: Use fs.readdirSync
  // Return array of file/folder names
}

// TODO: Check if path is a directory
export function isDirectory(dirPath) {
  // Your code here
  // Hint: Use fs.statSync and check isDirectory()
  // Return false if path doesn't exist
}

// TODO: Create nested directories (recursive)
export function createNestedDirectories(dirPath) {
  // Your code here
  // Hint: Use fs.mkdirSync with { recursive: true }
}

// TODO: Remove empty directory
export function removeEmptyDirectory(dirPath) {
  // Your code here
  // Hint: Use fs.rmdirSync
}

// TODO: Remove directory with all contents
export function removeDirectoryRecursive(dirPath) {
  // Your code here
  // Hint: Use fs.rmSync with { recursive: true, force: true }
}

// TODO: Count files in directory
export function countFilesInDirectory(dirPath) {
  // Your code here
  // Hint: Read directory and filter only files using fs.statSync
  // Return count of files (not directories)
}

// Tests
describe('Exercise 97: fs directories', () => {
  it('should create directory synchronously', () => {
    const dirPath = path.join(TEST_DIR, 'sync-dir');
    createDirectorySync(dirPath);

    expect(fs.existsSync(dirPath)).toBe(true);
    expect(fs.statSync(dirPath).isDirectory()).toBe(true);
  });

  it('should create directory asynchronously', async () => {
    const dirPath = path.join(TEST_DIR, 'async-dir');
    await createDirectoryAsync(dirPath);

    expect(fs.existsSync(dirPath)).toBe(true);
    expect(fs.statSync(dirPath).isDirectory()).toBe(true);
  });

  it('should list directory contents', () => {
    const dirPath = path.join(TEST_DIR, 'list-dir');
    fs.mkdirSync(dirPath);
    fs.writeFileSync(path.join(dirPath, 'file1.txt'), 'content');
    fs.writeFileSync(path.join(dirPath, 'file2.txt'), 'content');
    fs.mkdirSync(path.join(dirPath, 'subdir'));

    const contents = listDirectory(dirPath);
    expect(contents).toHaveLength(3);
    expect(contents).toContain('file1.txt');
    expect(contents).toContain('file2.txt');
    expect(contents).toContain('subdir');
  });

  it('should check if path is directory', () => {
    const dirPath = path.join(TEST_DIR, 'check-dir');
    const filePath = path.join(TEST_DIR, 'check-file.txt');

    fs.mkdirSync(dirPath);
    fs.writeFileSync(filePath, 'content');

    expect(isDirectory(dirPath)).toBe(true);
    expect(isDirectory(filePath)).toBe(false);
    expect(isDirectory('/nonexistent/path')).toBe(false);
  });

  it('should create nested directories', () => {
    const nestedPath = path.join(TEST_DIR, 'level1', 'level2', 'level3');
    createNestedDirectories(nestedPath);

    expect(fs.existsSync(nestedPath)).toBe(true);
    expect(fs.statSync(nestedPath).isDirectory()).toBe(true);
  });

  it('should remove empty directory', () => {
    const dirPath = path.join(TEST_DIR, 'empty-dir');
    fs.mkdirSync(dirPath);

    removeEmptyDirectory(dirPath);

    expect(fs.existsSync(dirPath)).toBe(false);
  });

  it('should remove directory with contents', () => {
    const dirPath = path.join(TEST_DIR, 'full-dir');
    fs.mkdirSync(dirPath);
    fs.writeFileSync(path.join(dirPath, 'file.txt'), 'content');
    fs.mkdirSync(path.join(dirPath, 'subdir'));

    removeDirectoryRecursive(dirPath);

    expect(fs.existsSync(dirPath)).toBe(false);
  });

  it('should count files in directory', () => {
    const dirPath = path.join(TEST_DIR, 'count-dir');
    fs.mkdirSync(dirPath);
    fs.writeFileSync(path.join(dirPath, 'file1.txt'), 'content');
    fs.writeFileSync(path.join(dirPath, 'file2.txt'), 'content');
    fs.writeFileSync(path.join(dirPath, 'file3.txt'), 'content');
    fs.mkdirSync(path.join(dirPath, 'subdir1'));
    fs.mkdirSync(path.join(dirPath, 'subdir2'));

    const count = countFilesInDirectory(dirPath);
    expect(count).toBe(3);
  });
});
