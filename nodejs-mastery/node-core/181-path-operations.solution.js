import { describe, it, expect } from 'vitest';
import path from 'path';

/**
 * Exercise 181: Path Module - Operations - SOLUTION
 */

export function normalizePath(messyPath) {
  return path.normalize(messyPath);
}

export function isPathAbsolute(pathToCheck) {
  return path.isAbsolute(pathToCheck);
}

export function getRelativePath(from, to) {
  return path.relative(from, to);
}

export function cleanPath(userPath) {
  const normalized = path.normalize(userPath);
  if (path.isAbsolute(normalized)) {
    return normalized;
  }
  return path.resolve(normalized);
}

export function pathFromRoot(projectRoot, filePath) {
  return path.relative(projectRoot, filePath);
}

export function hasPathTraversal(userPath) {
  const normalized = path.normalize(userPath);
  return normalized.startsWith('..');
}

export function resolveSibling(filePath, siblingName) {
  const dir = path.dirname(filePath);
  return path.join(dir, siblingName);
}

export function safeJoin(baseDir, ...segments) {
  const joined = path.join(baseDir, ...segments);
  const normalized = path.normalize(joined);

  // Ensure the result starts with baseDir (doesn't escape)
  if (!normalized.startsWith(path.normalize(baseDir))) {
    return null;
  }

  return normalized;
}

// Tests
describe('Exercise 181: Path Operations - Solution', () => {
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
