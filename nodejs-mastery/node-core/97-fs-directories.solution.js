import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

/**
 * Exercise 97: File System - Working with Directories - SOLUTION
 */

const TEST_DIR = path.join(process.cwd(), 'test-directories');

beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
});

afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

export function createDirectorySync(dirPath) {
  fs.mkdirSync(dirPath);
}

export async function createDirectoryAsync(dirPath) {
  await fsPromises.mkdir(dirPath);
}

export function listDirectory(dirPath) {
  return fs.readdirSync(dirPath);
}

export function isDirectory(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

export function createNestedDirectories(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function removeEmptyDirectory(dirPath) {
  fs.rmdirSync(dirPath);
}

export function removeDirectoryRecursive(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

export function countFilesInDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  return items.filter(item => {
    const itemPath = path.join(dirPath, item);
    return fs.statSync(itemPath).isFile();
  }).length;
}

// Tests
describe('Exercise 97: fs directories - Solution', () => {
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
