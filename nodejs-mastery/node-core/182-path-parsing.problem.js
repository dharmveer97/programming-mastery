import { describe, it, expect } from 'vitest';
import path from 'path';

/**
 * Exercise 182: Path Module - Parsing and Formatting
 *
 * Parse and format paths using path objects.
 *
 * Key methods:
 * - path.parse(path) - returns object with: root, dir, base, ext, name
 * - path.format(pathObject) - creates path string from object
 *
 * Path object structure:
 * {
 *   root: '/',           // root of the path
 *   dir: '/home/user',   // directory
 *   base: 'file.txt',    // file name with extension
 *   ext: '.txt',         // extension
 *   name: 'file'         // file name without extension
 * }
 *
 * Task: Master path parsing and formatting
 */

// TODO: Parse a file path into its components
// Return the parsed path object
export function parseFilePath(filePath) {
  // Your code here
}

// TODO: Build a path from components
// Given an object with dir, name, and ext, create full path
export function buildPath(components) {
  // Your code here
  // Use path.format()
}

// TODO: Change file extension
// Example: ('file.txt', '.md') -> 'file.md'
export function changeExtension(filePath, newExt) {
  // Your code here
  // Parse the path, change ext, format back
}

// TODO: Add suffix to filename
// Example: ('photo.jpg', '-thumbnail') -> 'photo-thumbnail.jpg'
export function addSuffix(filePath, suffix) {
  // Your code here
  // Parse, modify name, format back
}

// TODO: Extract path info for a backup file
// Given a file path, create backup path with .bak extension
// Example: '/data/config.json' -> '/data/config.json.bak'
export function createBackupPath(originalPath) {
  // Your code here
}

// TODO: Parse multiple paths and group by extension
// Return object: { '.txt': [...], '.js': [...], ... }
export function groupByExtension(paths) {
  // Your code here
  // Parse each path and group by ext property
}

// TODO: Reconstruct path with different directory
// Keep filename, change directory
export function moveToDirectory(filePath, newDir) {
  // Your code here
  // Parse to get base, format with new dir
}

// TODO: Analyze path and return detailed info
// Return object with: isAbsolute, directory, filename, extension, nameWithoutExt
export function analyzePath(filePath) {
  // Your code here
  // Combine parsing with other path methods
}

// Tests
describe('Exercise 182: Path Parsing', () => {
  it('should parse file path', () => {
    const result = parseFilePath('/home/user/document.txt');
    expect(result).toHaveProperty('root');
    expect(result).toHaveProperty('dir');
    expect(result).toHaveProperty('base');
    expect(result).toHaveProperty('ext');
    expect(result).toHaveProperty('name');
    expect(result.name).toBe('document');
    expect(result.ext).toBe('.txt');
  });

  it('should build path from components', () => {
    const components = {
      dir: '/home/user',
      name: 'document',
      ext: '.txt'
    };
    const result = buildPath(components);
    expect(result).toBe(path.join('/home/user', 'document.txt'));
  });

  it('should change file extension', () => {
    expect(changeExtension('document.txt', '.md')).toBe('document.md');
    expect(changeExtension('/path/to/file.js', '.ts')).toBe('/path/to/file.ts');
  });

  it('should add suffix to filename', () => {
    expect(addSuffix('photo.jpg', '-thumbnail')).toBe('photo-thumbnail.jpg');
    expect(addSuffix('/images/avatar.png', '-small')).toBe('/images/avatar-small.png');
  });

  it('should create backup path', () => {
    expect(createBackupPath('/data/config.json')).toBe('/data/config.json.bak');
    expect(createBackupPath('settings.ini')).toBe('settings.ini.bak');
  });

  it('should group paths by extension', () => {
    const paths = [
      '/docs/readme.txt',
      '/src/index.js',
      '/docs/guide.txt',
      '/src/app.js',
      '/config.json'
    ];

    const result = groupByExtension(paths);
    expect(result['.txt']).toHaveLength(2);
    expect(result['.js']).toHaveLength(2);
    expect(result['.json']).toHaveLength(1);
  });

  it('should move file to different directory', () => {
    const result = moveToDirectory('/old/path/file.txt', '/new/path');
    expect(result).toBe(path.join('/new/path', 'file.txt'));
  });

  it('should analyze path comprehensively', () => {
    const result = analyzePath('/home/user/document.txt');

    expect(result).toEqual({
      isAbsolute: true,
      directory: '/home/user',
      filename: 'document.txt',
      extension: '.txt',
      nameWithoutExt: 'document'
    });

    const relativeResult = analyzePath('docs/readme.md');
    expect(relativeResult.isAbsolute).toBe(false);
  });
});
