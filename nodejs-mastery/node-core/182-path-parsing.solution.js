import { describe, it, expect } from 'vitest';
import path from 'path';

/**
 * Exercise 182: Path Module - Parsing and Formatting - SOLUTION
 */

export function parseFilePath(filePath) {
  return path.parse(filePath);
}

export function buildPath(components) {
  return path.format(components);
}

export function changeExtension(filePath, newExt) {
  const parsed = path.parse(filePath);
  parsed.ext = newExt;
  parsed.base = parsed.name + newExt;
  return path.format(parsed);
}

export function addSuffix(filePath, suffix) {
  const parsed = path.parse(filePath);
  parsed.name = parsed.name + suffix;
  parsed.base = parsed.name + parsed.ext;
  return path.format(parsed);
}

export function createBackupPath(originalPath) {
  const parsed = path.parse(originalPath);
  parsed.base = parsed.base + '.bak';
  parsed.ext = '.bak';
  return path.format(parsed);
}

export function groupByExtension(paths) {
  const groups = {};

  for (const filePath of paths) {
    const parsed = path.parse(filePath);
    const ext = parsed.ext;

    if (!groups[ext]) {
      groups[ext] = [];
    }

    groups[ext].push(filePath);
  }

  return groups;
}

export function moveToDirectory(filePath, newDir) {
  const parsed = path.parse(filePath);
  return path.join(newDir, parsed.base);
}

export function analyzePath(filePath) {
  const parsed = path.parse(filePath);

  return {
    isAbsolute: path.isAbsolute(filePath),
    directory: parsed.dir,
    filename: parsed.base,
    extension: parsed.ext,
    nameWithoutExt: parsed.name
  };
}

// Tests
describe('Exercise 182: Path Parsing - Solution', () => {
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
