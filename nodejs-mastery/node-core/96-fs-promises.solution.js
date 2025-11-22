import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

/**
 * Exercise 96: File System - Promises API - SOLUTION
 */

const TEST_DIR = path.join(process.cwd(), 'test-files-promises');

beforeAll(async () => {
  if (!fsSync.existsSync(TEST_DIR)) {
    await fs.mkdir(TEST_DIR);
  }
});

afterAll(async () => {
  if (fsSync.existsSync(TEST_DIR)) {
    const files = await fs.readdir(TEST_DIR);
    await Promise.all(files.map(file => fs.unlink(path.join(TEST_DIR, file))));
    await fs.rmdir(TEST_DIR);
  }
});

export async function readFilePromise(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

export async function writeFilePromise(filePath, content) {
  await fs.writeFile(filePath, content);
}

export async function copyFile(source, destination) {
  await fs.copyFile(source, destination);
}

export async function deleteFile(filePath) {
  await fs.unlink(filePath);
}

export async function readMultipleFiles(filePaths) {
  return await Promise.all(
    filePaths.map(filePath => fs.readFile(filePath, 'utf-8'))
  );
}

export async function fileExistsPromise(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function renameFile(oldPath, newPath) {
  await fs.rename(oldPath, newPath);
}

export async function processFile(inputPath, outputPath, processor) {
  const content = await fs.readFile(inputPath, 'utf-8');
  const processed = processor(content);
  await fs.writeFile(outputPath, processed);
}

// Tests
describe('Exercise 96: fs.promises - Solution', () => {
  it('should read file using promises', async () => {
    const filePath = path.join(TEST_DIR, 'read-test.txt');
    await fs.writeFile(filePath, 'Promise content');

    const content = await readFilePromise(filePath);
    expect(content).toBe('Promise content');
  });

  it('should write file using promises', async () => {
    const filePath = path.join(TEST_DIR, 'write-test.txt');
    await writeFilePromise(filePath, 'Written with promises');

    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('Written with promises');
  });

  it('should copy file', async () => {
    const source = path.join(TEST_DIR, 'source.txt');
    const dest = path.join(TEST_DIR, 'destination.txt');

    await fs.writeFile(source, 'Content to copy');
    await copyFile(source, dest);

    const content = await fs.readFile(dest, 'utf-8');
    expect(content).toBe('Content to copy');
  });

  it('should delete file', async () => {
    const filePath = path.join(TEST_DIR, 'delete-me.txt');
    await fs.writeFile(filePath, 'Temporary');

    await deleteFile(filePath);

    const exists = fsSync.existsSync(filePath);
    expect(exists).toBe(false);
  });

  it('should read multiple files concurrently', async () => {
    const files = ['file1.txt', 'file2.txt', 'file3.txt'];
    const contents = ['Content 1', 'Content 2', 'Content 3'];

    for (let i = 0; i < files.length; i++) {
      await fs.writeFile(path.join(TEST_DIR, files[i]), contents[i]);
    }

    const filePaths = files.map(f => path.join(TEST_DIR, f));
    const results = await readMultipleFiles(filePaths);

    expect(results).toEqual(contents);
  });

  it('should check if file exists', async () => {
    const existingFile = path.join(TEST_DIR, 'exists.txt');
    await fs.writeFile(existingFile, 'I exist');

    const exists = await fileExistsPromise(existingFile);
    const notExists = await fileExistsPromise(path.join(TEST_DIR, 'not-exists.txt'));

    expect(exists).toBe(true);
    expect(notExists).toBe(false);
  });

  it('should rename file', async () => {
    const oldPath = path.join(TEST_DIR, 'old-name.txt');
    const newPath = path.join(TEST_DIR, 'new-name.txt');

    await fs.writeFile(oldPath, 'Rename me');
    await renameFile(oldPath, newPath);

    const exists = fsSync.existsSync(newPath);
    const oldExists = fsSync.existsSync(oldPath);

    expect(exists).toBe(true);
    expect(oldExists).toBe(false);
  });

  it('should process file with transformation', async () => {
    const inputPath = path.join(TEST_DIR, 'input.txt');
    const outputPath = path.join(TEST_DIR, 'output.txt');

    await fs.writeFile(inputPath, 'hello world');

    const toUpperCase = (content) => content.toUpperCase();
    await processFile(inputPath, outputPath, toUpperCase);

    const result = await fs.readFile(outputPath, 'utf-8');
    expect(result).toBe('HELLO WORLD');
  });
});
