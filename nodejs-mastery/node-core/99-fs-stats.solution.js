import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

/**
 * Exercise 99: File System - File Stats and Metadata - SOLUTION
 */

const TEST_DIR = path.join(process.cwd(), 'test-stats');

beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
  fs.writeFileSync(path.join(TEST_DIR, 'sample.txt'), 'Hello World!');
  fs.mkdirSync(path.join(TEST_DIR, 'subdir'), { recursive: true });
});

afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

export function getFileStats(filePath) {
  return fs.statSync(filePath);
}

export async function getFileStatsAsync(filePath) {
  return await fsPromises.stat(filePath);
}

export function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

export function getFileSize(filePath) {
  return fs.statSync(filePath).size;
}

export function getFileSizeFormatted(filePath) {
  const bytes = fs.statSync(filePath).size;

  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

export function getLastModified(filePath) {
  return fs.statSync(filePath).mtime;
}

export function wasModifiedAfter(filePath, date) {
  const mtime = fs.statSync(filePath).mtime;
  return mtime > date;
}

export function getFileInfo(filePath) {
  const stats = fs.statSync(filePath);

  return {
    name: path.basename(filePath),
    size: stats.size,
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    created: stats.birthtime,
    modified: stats.mtime
  };
}

// Tests
describe('Exercise 99: fs.stat - Solution', () => {
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

    expect(size).toBe(12);
  });

  it('should get file size in human-readable format', () => {
    const smallFile = path.join(TEST_DIR, 'small.txt');
    const mediumFile = path.join(TEST_DIR, 'medium.txt');

    fs.writeFileSync(smallFile, 'a'.repeat(500));
    fs.writeFileSync(mediumFile, 'a'.repeat(5000));

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
    fs.writeFileSync(largeFile, 'a'.repeat(2 * 1024 * 1024));

    const formatted = getFileSizeFormatted(largeFile);
    expect(formatted).toContain('MB');
  });
});
