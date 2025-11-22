import { describe, it, expect } from 'vitest';
import path from 'path';

/**
 * Exercise 180: Path Module - Basics - SOLUTION
 */

export function joinPaths(part1, part2, part3) {
  return path.join(part1, part2, part3);
}

export function getDirectory(filePath) {
  return path.dirname(filePath);
}

export function getFileName(filePath) {
  return path.basename(filePath);
}

export function getFileNameWithoutExt(filePath) {
  const ext = path.extname(filePath);
  return path.basename(filePath, ext);
}

export function getFileExtension(filePath) {
  return path.extname(filePath);
}

export function createAbsolutePath(...segments) {
  return path.resolve(...segments);
}

export function buildConfigPath(baseDir, configName) {
  return path.join(baseDir, 'config', configName);
}

export function parseLogPath(logPath) {
  return {
    directory: path.dirname(logPath),
    filename: path.basename(logPath),
    name: path.basename(logPath, path.extname(logPath)),
    extension: path.extname(logPath)
  };
}

// Tests
describe('Exercise 180: Path Basics - Solution', () => {
  it('should join path segments', () => {
    const result = joinPaths('users', 'john', 'documents');
    expect(result).toBe(path.join('users', 'john', 'documents'));
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
