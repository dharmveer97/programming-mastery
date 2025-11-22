import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 95: File System - Write Files - SOLUTION
 */

const TEST_DIR = path.join(process.cwd(), 'test-files-write');

beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
});

afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    const files = fs.readdirSync(TEST_DIR);
    files.forEach(file => {
      fs.unlinkSync(path.join(TEST_DIR, file));
    });
    fs.rmdirSync(TEST_DIR);
  }
});

export function writeFileSync(filePath, content) {
  fs.writeFileSync(filePath, content);
}

export function writeFileAsync(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function appendToFileSync(filePath, content) {
  fs.appendFileSync(filePath, content);
}

export function appendToFileAsync(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, content, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function writeJSON(filePath, data) {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonString);
}

export function writeWithEncoding(filePath, content, encoding = 'utf-8') {
  fs.writeFileSync(filePath, content, encoding);
}

// Tests
describe('Exercise 95: fs.writeFile - Solution', () => {
  it('should write file synchronously', () => {
    const filePath = path.join(TEST_DIR, 'sync.txt');
    writeFileSync(filePath, 'Hello World');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Hello World');
  });

  it('should write file asynchronously', async () => {
    const filePath = path.join(TEST_DIR, 'async.txt');
    await writeFileAsync(filePath, 'Async Content');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Async Content');
  });

  it('should append to file synchronously', () => {
    const filePath = path.join(TEST_DIR, 'append-sync.txt');
    fs.writeFileSync(filePath, 'Line 1\n');
    appendToFileSync(filePath, 'Line 2\n');
    appendToFileSync(filePath, 'Line 3');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Line 1\nLine 2\nLine 3');
  });

  it('should append to file asynchronously', async () => {
    const filePath = path.join(TEST_DIR, 'append-async.txt');
    fs.writeFileSync(filePath, 'Start\n');
    await appendToFileAsync(filePath, 'Middle\n');
    await appendToFileAsync(filePath, 'End');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Start\nMiddle\nEnd');
  });

  it('should write JSON to file', () => {
    const filePath = path.join(TEST_DIR, 'data.json');
    const data = { name: 'John', age: 30, city: 'New York' };

    writeJSON(filePath, data);

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed).toEqual(data);
  });

  it('should write file with specific encoding', () => {
    const filePath = path.join(TEST_DIR, 'encoded.txt');
    writeWithEncoding(filePath, 'Hello World', 'utf-8');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Hello World');
  });

  it('should overwrite existing file', () => {
    const filePath = path.join(TEST_DIR, 'overwrite.txt');
    writeFileSync(filePath, 'First content');
    writeFileSync(filePath, 'Second content');

    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toBe('Second content');
  });

  it('should handle multiple async writes', async () => {
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];

    await Promise.all(
      files.map((file, index) =>
        writeFileAsync(path.join(TEST_DIR, file), `Content ${index + 1}`)
      )
    );

    files.forEach((file, index) => {
      const content = fs.readFileSync(path.join(TEST_DIR, file), 'utf-8');
      expect(content).toBe(`Content ${index + 1}`);
    });
  });
});
