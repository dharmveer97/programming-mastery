import { describe, it, expect } from 'vitest';
import { Writable, Readable } from 'stream';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 238: Writable Streams - Writing to Streams
 *
 * Writable streams are abstractions for destinations to which data can be written.
 * They're used for writing files, HTTP requests, stdout, and more.
 *
 * Key concepts:
 * - write(chunk) - write data to stream
 * - end() - signal no more data to write
 * - 'drain' event - emitted when buffer is empty
 * - 'finish' event - emitted after end() and all data flushed
 * - 'error' event - emitted on errors
 *
 * Task: Work with writable streams
 */

// TODO: Create a simple writable stream that collects data
// Store all written chunks in an array
export function createCollectorStream() {
  const data = [];

  const stream = new Writable({
    write(chunk, encoding, callback) {
      // Your code here
    }
  });

  stream.getData = () => data;
  return stream;
}

// TODO: Write data to a writable stream and wait for finish
// Write all items from array and return when finished
export function writeToStream(stream, items) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Write each item, call end(), listen to 'finish' event
  });
}

// TODO: Create a writable stream that transforms data before storing
// Convert all chunks to uppercase before collecting
export function createUppercaseWriter() {
  const data = [];

  // Your code here
  // Hint: Transform chunk in write() method
}

// TODO: Handle backpressure with write() return value
// Write items respecting backpressure (when write returns false, wait for drain)
export function writeWithBackpressure(stream, items) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Check write() return value, use 'drain' event
  });
}

// TODO: Create a writable stream that writes to a file
// Write data to file path provided
export function createFileWriter(filePath) {
  // Your code here
  // Hint: Use fs.createWriteStream()
}

// TODO: Handle errors in writable streams
// Return 'success' if write completes, return error message if error occurs
export function writeWithErrorHandling(stream, data) {
  return new Promise((resolve) => {
    // Your code here
    // Hint: Listen to both 'error' and 'finish' events
  });
}

// TODO: Create a writable stream with high water mark
// Track how many times 'drain' event fires
export function createStreamWithWaterMark(highWaterMark = 16) {
  let drainCount = 0;

  const stream = new Writable({
    highWaterMark,
    write(chunk, encoding, callback) {
      // Your code here
    }
  });

  stream.getDrainCount = () => drainCount;
  return stream;
}

// TODO: Cork and uncork a writable stream
// Cork stream, write multiple chunks, uncork to flush
export function writeWithCork(stream, items) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Use cork() before writes, uncork() after
  });
}

// Tests
describe('Exercise 238: Writable Streams', () => {
  it('should collect written data', async () => {
    const stream = createCollectorStream();

    stream.write('Hello');
    stream.write(' ');
    stream.write('World');
    stream.end();

    await new Promise(resolve => stream.on('finish', resolve));

    const data = stream.getData();
    expect(data.join('')).toBe('Hello World');
  });

  it('should write array items to stream', async () => {
    const stream = createCollectorStream();
    const items = ['Node', 'JS', 'Streams'];

    await writeToStream(stream, items);

    expect(stream.getData()).toEqual(items);
  });

  it('should transform data to uppercase', async () => {
    const stream = createUppercaseWriter();

    stream.write('hello');
    stream.write('world');
    stream.end();

    await new Promise(resolve => stream.on('finish', resolve));

    const data = stream.getData();
    expect(data).toEqual(['HELLO', 'WORLD']);
  });

  it('should handle backpressure', async () => {
    const stream = createCollectorStream();
    const items = Array(100).fill('data');

    await writeWithBackpressure(stream, items);

    expect(stream.getData().length).toBe(100);
  });

  it('should write to file', async () => {
    const testFile = path.join(process.cwd(), 'test-write.txt');
    const stream = createFileWriter(testFile);

    stream.write('Hello File\n');
    stream.write('Second Line\n');
    stream.end();

    await new Promise(resolve => stream.on('finish', resolve));

    const content = fs.readFileSync(testFile, 'utf8');
    expect(content).toBe('Hello File\nSecond Line\n');

    // Cleanup
    fs.unlinkSync(testFile);
  });

  it('should handle write errors', async () => {
    const errorStream = new Writable({
      write(chunk, encoding, callback) {
        callback(new Error('Write failed'));
      }
    });

    const result = await writeWithErrorHandling(errorStream, 'test');
    expect(result).toContain('Write failed');
  });

  it('should track drain events', async () => {
    const stream = createStreamWithWaterMark(10);

    // Write data larger than high water mark
    for (let i = 0; i < 20; i++) {
      stream.write('x'.repeat(10));
    }
    stream.end();

    await new Promise(resolve => stream.on('finish', resolve));

    expect(stream.getDrainCount()).toBeGreaterThan(0);
  });

  it('should cork and uncork stream', async () => {
    const stream = createCollectorStream();
    const items = ['a', 'b', 'c'];

    await writeWithCork(stream, items);

    expect(stream.getData()).toEqual(items);
  });
});
