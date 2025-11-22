import { describe, it, expect } from 'vitest';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 237: Readable Streams - Creating and Reading from Streams
 *
 * Readable streams are abstractions for sources from which data can be read.
 * They're used for reading files, HTTP responses, stdin, and more.
 *
 * Key concepts:
 * - 'data' event - emitted when data is available
 * - 'end' event - emitted when no more data
 * - 'error' event - emitted on errors
 * - read() method - pull data from stream
 * - pause() and resume() - control flow
 *
 * Task: Work with readable streams
 */

// TODO: Create a simple readable stream that emits array items
// Should emit each item in the array as data chunks
export function createArrayStream(items) {
  // Your code here
  // Hint: Extend Readable and implement _read()
}

// TODO: Read data from a readable stream using 'data' event
// Collect all chunks and return concatenated result
export function readStreamWithEvents(stream) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Listen to 'data', 'end', and 'error' events
  });
}

// TODO: Read data from stream using read() method in flowing mode
// Return all data as a string
export function readStreamFlowing(stream) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Set encoding and use 'readable' event
  });
}

// TODO: Create a readable stream that pauses and resumes
// Read data slowly, pausing after each chunk
export function readWithPauses(stream, pauseDuration = 10) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    // Your code here
    // Hint: Use pause() and setTimeout with resume()
  });
}

// TODO: Create a custom readable stream from a generator
// Yield numbers from start to end
export function createNumberStream(start, end) {
  // Your code here
  // Hint: Use Readable.from() or implement custom stream
}

// TODO: Handle errors in readable streams
// Return error message if stream emits error, otherwise return data
export function readStreamWithErrorHandling(stream) {
  return new Promise((resolve) => {
    // Your code here
    // Hint: Listen to both 'error' and 'data'/'end' events
  });
}

// TODO: Create a readable stream that reads lines from a file
// Each line should be a separate chunk
export function createLineStream(filePath) {
  // Your code here
  // Hint: Use fs.createReadStream with proper options
}

// TODO: Count total bytes read from a stream
// Return the total number of bytes
export function countStreamBytes(stream) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Track length of each chunk
  });
}

// Tests
describe('Exercise 237: Readable Streams', () => {
  it('should create readable stream from array', async () => {
    const items = ['Hello', ' ', 'World'];
    const stream = createArrayStream(items);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(items);
  });

  it('should read stream using data events', async () => {
    const stream = Readable.from(['Hello', ' ', 'World']);
    const result = await readStreamWithEvents(stream);
    expect(result).toBe('Hello World');
  });

  it('should read stream in flowing mode', async () => {
    const stream = Readable.from(['Node', 'JS']);
    stream.setEncoding('utf8');
    const result = await readStreamFlowing(stream);
    expect(result).toBe('NodeJS');
  });

  it('should read with pauses', async () => {
    const stream = Readable.from(['a', 'b', 'c']);
    const result = await readWithPauses(stream, 5);
    expect(result).toBe('abc');
  });

  it('should create number stream', async () => {
    const stream = createNumberStream(1, 5);
    const numbers = [];

    for await (const num of stream) {
      numbers.push(num);
    }

    expect(numbers).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle stream errors', async () => {
    const errorStream = new Readable({
      read() {
        this.emit('error', new Error('Stream error'));
      }
    });

    const result = await readStreamWithErrorHandling(errorStream);
    expect(result).toContain('Stream error');
  });

  it('should read file as line stream', async () => {
    // Create a temporary test file
    const testFile = path.join(process.cwd(), 'test-lines.txt');
    fs.writeFileSync(testFile, 'Line 1\nLine 2\nLine 3');

    const stream = createLineStream(testFile);
    const lines = [];

    stream.on('data', (line) => {
      lines.push(line.toString().trim());
    });

    await new Promise((resolve) => stream.on('end', resolve));

    expect(lines.filter(l => l)).toHaveLength(3);

    // Cleanup
    fs.unlinkSync(testFile);
  });

  it('should count stream bytes', async () => {
    const data = 'Hello World';
    const stream = Readable.from([data]);
    const bytes = await countStreamBytes(stream);
    expect(bytes).toBe(Buffer.byteLength(data));
  });
});
