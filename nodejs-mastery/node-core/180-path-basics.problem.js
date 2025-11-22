import { describe, it, expect } from 'vitest';
import path from 'path';

/**
 * Exercise 180: Path Module - Basics
 *
 * The path module provides utilities for working with file and directory paths.
 * It handles cross-platform differences (Windows vs Unix).
 *
 * Key methods:
 * - path.join(...paths) - joins path segments with platform-specific separator
 * - path.resolve(...paths) - resolves to absolute path
 * - path.dirname(path) - returns directory name
 * - path.basename(path, ext) - returns last part of path
 * - path.extname(path) - returns file extension
 *
 * Task: Master basic path operations
 */

// TODO: Join multiple path segments into one path
// Should handle platform-specific separators automatically
export function joinPaths(part1, part2, part3) {
  // Your code here
  // Hint: Use path.join()
}

// TODO: Get the directory name from a file path
// Example: '/users/john/file.txt' -> '/users/john'
export function getDirectory(filePath) {
  // Your code here
}

// TODO: Get the file name from a path
// Example: '/users/john/document.pdf' -> 'document.pdf'
export function getFileName(filePath) {
  // Your code here
}

// TODO: Get the file name without extension
// Example: '/users/john/photo.jpg' -> 'photo'
export function getFileNameWithoutExt(filePath) {
  // Your code here
  // Hint: Use path.basename() with second argument
}

// TODO: Get the file extension
// Example: 'document.txt' -> '.txt'
export function getFileExtension(filePath) {
  // Your code here
}

// TODO: Create an absolute path from relative segments
// Should resolve relative to current working directory
export function createAbsolutePath(...segments) {
  // Your code here
  // Hint: Use path.resolve()
}

// TODO: Build a config file path
// Given a base directory and filename, create full path
export function buildConfigPath(baseDir, configName) {
  // Your code here
  // Return path like: baseDir/config/configName
}

// TODO: Parse a log file path to extract info
// Return an object with: directory, filename, name (without ext), extension
export function parseLogPath(logPath) {
  // Your code here
  // Return: { directory: '...', filename: '...', name: '...', extension: '...' }
}

// Tests
describe('Exercise 180: Path Basics', () => {
  it('should join path segments', () => {
    const result = joinPaths('users', 'john', 'documents');
    expect(result).toBe(path.join('users', 'john', 'documents'));
    // Works across platforms: 'users/john/documents' on Unix, 'users\\john\\documents' on Windows
  });

  it('should get directory name', () => {
    expect(getDirectory('/users/john/file.txt')).toBe('/users/john');
    expect(getDirectory('folder/file.txt')).toBe('folder');
  });

  it('should get file name', () => {
    expect(getFileName('/users/john/document.pdf')).toBe('document.pdf');
    expect(getFileName('/var/log/app.log')).toBe('app.log');
  });

  it('should get file name without extension', () => {
    expect(getFileNameWithoutExt('/users/john/photo.jpg')).toBe('photo');
    expect(getFileNameWithoutExt('archive.tar.gz')).toBe('archive.tar');
  });

  it('should get file extension', () => {
    expect(getFileExtension('document.txt')).toBe('.txt');
    expect(getFileExtension('photo.jpg')).toBe('.jpg');
    expect(getFileExtension('archive.tar.gz')).toBe('.gz');
    expect(getFileExtension('README')).toBe('');
  });

  it('should create absolute path', () => {
    const result = createAbsolutePath('test', 'file.txt');
    expect(path.isAbsolute(result)).toBe(true);
    expect(result).toContain('file.txt');
  });

  it('should build config path', () => {
    const result = buildConfigPath('/app', 'database.json');
    expect(result).toBe(path.join('/app', 'config', 'database.json'));
  });

  it('should parse log path', () => {
    const result = parseLogPath('/var/log/app.log');
    expect(result).toEqual({
      directory: '/var/log',
      filename: 'app.log',
      name: 'app',
      extension: '.log'
    });
  });
});
