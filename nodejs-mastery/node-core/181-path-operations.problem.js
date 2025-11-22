import { describe, it, expect } from 'vitest';
import path from 'path';

/**
 * Exercise 181: Path Module - Operations
 *
 * Advanced path operations for path manipulation and comparison.
 *
 * Key methods:
 * - path.normalize(path) - normalizes path (removes .., ., extra slashes)
 * - path.relative(from, to) - calculates relative path from one to another
 * - path.isAbsolute(path) - checks if path is absolute
 *
 * Common pitfalls:
 * - Windows paths: C:\Users vs /Users (Unix)
 * - Path separators: \ (Windows) vs / (Unix)
 * - Relative paths: ./ and ../
 *
 * Task: Work with path operations and handle cross-platform scenarios
 */

// TODO: Normalize a messy path
// Should remove unnecessary .., ., and extra slashes
// Example: '/users/./john/../jane/documents' -> '/users/jane/documents'
export function normalizePath(messyPath) {
  // Your code here
}

// TODO: Check if a path is absolute
export function isPathAbsolute(pathToCheck) {
  // Your code here
}

// TODO: Get relative path from one location to another
// Example: from '/users/john' to '/users/jane/file.txt' -> '../jane/file.txt'
export function getRelativePath(from, to) {
  // Your code here
}

// TODO: Clean up user-provided paths
// Normalize and convert to absolute if relative
export function cleanPath(userPath) {
  // Your code here
  // Hint: Normalize first, then resolve if not absolute
}

// TODO: Calculate path from project root to a file
// Given projectRoot and filePath (absolute), return relative path
export function pathFromRoot(projectRoot, filePath) {
  // Your code here
}

// TODO: Detect path traversal attack attempts
// Return true if path tries to escape using ../
// Example: '../../etc/passwd' -> true, 'docs/file.txt' -> false
export function hasPathTraversal(userPath) {
  // Your code here
  // Hint: Normalize and check if it starts with '..'
}

// TODO: Resolve sibling file path
// Given a file path, return path to a sibling file
// Example: ('/app/src/index.js', 'config.js') -> '/app/src/config.js'
export function resolveSibling(filePath, siblingName) {
  // Your code here
}

// TODO: Create a safe joined path
// Join paths but ensure result doesn't escape baseDir
// Return null if unsafe
export function safeJoin(baseDir, ...segments) {
  // Your code here
  // Join paths, normalize, and check if result starts with baseDir
}

// Tests
describe('Exercise 181: Path Operations', () => {
  it('should normalize messy paths', () => {
    expect(normalizePath('/users/./john/../jane/documents')).toBe(
      path.normalize('/users/./john/../jane/documents')
    );
    expect(normalizePath('users//john///documents')).toBe(
      path.normalize('users//john///documents')
    );
  });

  it('should check if path is absolute', () => {
    expect(isPathAbsolute('/users/john')).toBe(true);
    expect(isPathAbsolute('./users/john')).toBe(false);
    expect(isPathAbsolute('../john')).toBe(false);
    expect(isPathAbsolute('relative/path')).toBe(false);
  });

  it('should get relative path', () => {
    const result = getRelativePath('/users/john', '/users/jane/file.txt');
    expect(result).toBe(path.relative('/users/john', '/users/jane/file.txt'));
  });

  it('should clean up user paths', () => {
    const messy = './users/../john/./documents';
    const result = cleanPath(messy);
    expect(path.isAbsolute(result)).toBe(true);
    expect(result).toContain('john');
  });

  it('should calculate path from project root', () => {
    const root = '/projects/myapp';
    const file = '/projects/myapp/src/index.js';
    expect(pathFromRoot(root, file)).toBe(path.join('src', 'index.js'));
  });

  it('should detect path traversal attempts', () => {
    expect(hasPathTraversal('../../etc/passwd')).toBe(true);
    expect(hasPathTraversal('../secret.txt')).toBe(true);
    expect(hasPathTraversal('docs/file.txt')).toBe(false);
    expect(hasPathTraversal('./docs/file.txt')).toBe(false);
  });

  it('should resolve sibling file path', () => {
    const result = resolveSibling('/app/src/index.js', 'config.js');
    expect(result).toBe(path.join('/app/src', 'config.js'));
  });

  it('should create safe joined paths', () => {
    const baseDir = '/safe/directory';

    // Safe paths
    expect(safeJoin(baseDir, 'file.txt')).toBe(path.join(baseDir, 'file.txt'));
    expect(safeJoin(baseDir, 'sub', 'file.txt')).toBe(path.join(baseDir, 'sub', 'file.txt'));

    // Unsafe path (tries to escape)
    expect(safeJoin(baseDir, '../../../etc/passwd')).toBe(null);
  });
});
