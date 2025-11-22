import { describe, it, expect } from 'vitest';
import { Readable, Writable, Transform, pipeline } from 'stream';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const pipelineAsync = promisify(pipeline);

/**
 * Exercise 240: Pipe and Pipeline - Chaining Streams
 *
 * pipe() and pipeline() allow you to chain streams together,
 * where the output of one stream becomes the input of another.
 *
 * Key concepts:
 * - pipe() - connect streams (older method)
 * - pipeline() - connect streams with better error handling
 * - Automatic backpressure handling
 * - Error propagation in pipeline
 * - Cleanup on errors
 *
 * Task: Chain streams using pipe and pipeline
 */

// TODO: Use pipe() to connect readable to writable
// Pipe source stream to destination stream
export function simplePipe(source, destination) {
  // Your code here
  // Hint: Use source.pipe(destination)
}

// TODO: Use pipeline() to connect multiple streams
// Connect source through transforms to destination with error handling
export function simplePipeline(source, transforms, destination) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Use pipeline(source, ...transforms, destination, callback)
  });
}

// TODO: Create a file copy using streams
// Read from sourcePath and write to destPath using pipe
export function copyFileWithPipe(sourcePath, destPath) {
  return new Promise((resolve, reject) => {
    // Your code here
    // Hint: Create read and write streams, pipe them
  });
}

// TODO: Create a file transformation pipeline
// Read file, transform (uppercase), write to new file
export function transformFile(sourcePath, destPath) {
  // Your code here
  // Hint: Use pipeline with fs streams and Transform
}

// TODO: Handle errors in pipeline
// Return 'success' if pipeline completes, error message if it fails
export async function pipelineWithErrorHandling(streams) {
  try {
    // Your code here
  } catch (err) {
    // Your code here
  }
}

// TODO: Chain multiple transforms using pipeline
// Apply multiple transformations in sequence
export function chainTransformsPipeline(input, ...transforms) {
  return new Promise((resolve, reject) => {
    const output = [];

    const writable = new Writable({
      write(chunk, encoding, callback) {
        output.push(chunk.toString());
        callback();
      }
    });

    // Your code here
    // Hint: pipeline(Readable.from(input), ...transforms, writable, callback)
  });
}

// TODO: Create a data processing pipeline
// Read data -> filter -> transform -> collect
export async function processDataPipeline(data, filterFn, transformFn) {
  const output = [];

  // Your code here
  // Hint: Create transform streams for filter and transform operations
}

// TODO: Compare pipe vs pipeline error handling
// Return whether error was caught (pipeline catches, pipe might not)
export function comparePipeAndPipeline(shouldError) {
  return new Promise((resolve) => {
    const source = new Readable({
      read() {
        if (shouldError) {
          this.destroy(new Error('Stream error'));
        } else {
          this.push('data');
          this.push(null);
        }
      }
    });

    const dest = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    // Your code here
    // Try using pipeline and check if error is caught
  });
}

// Tests
describe('Exercise 240: Pipe and Pipeline', () => {
  it('should pipe streams together', async () => {
    const source = Readable.from(['Hello', ' ', 'World']);
    const chunks = [];
    const destination = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk.toString());
        callback();
      }
    });

    simplePipe(source, destination);

    await new Promise(resolve => destination.on('finish', resolve));
    expect(chunks.join('')).toBe('Hello World');
  });

  it('should use pipeline to connect streams', async () => {
    const source = Readable.from(['hello', 'world']);
    const transform = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
      }
    });
    const chunks = [];
    const destination = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk.toString());
        callback();
      }
    });

    await simplePipeline(source, [transform], destination);
    expect(chunks.join('')).toBe('HELLOWORLD');
  });

  it('should copy file using pipe', async () => {
    const source = path.join(process.cwd(), 'test-source.txt');
    const dest = path.join(process.cwd(), 'test-dest.txt');

    fs.writeFileSync(source, 'Test content');

    await copyFileWithPipe(source, dest);

    const content = fs.readFileSync(dest, 'utf8');
    expect(content).toBe('Test content');

    // Cleanup
    fs.unlinkSync(source);
    fs.unlinkSync(dest);
  });

  it('should transform file content', async () => {
    const source = path.join(process.cwd(), 'test-input.txt');
    const dest = path.join(process.cwd(), 'test-output.txt');

    fs.writeFileSync(source, 'hello world');

    await transformFile(source, dest);

    const content = fs.readFileSync(dest, 'utf8');
    expect(content).toBe('HELLO WORLD');

    // Cleanup
    fs.unlinkSync(source);
    fs.unlinkSync(dest);
  });

  it('should handle pipeline errors', async () => {
    const errorStream = new Readable({
      read() {
        this.destroy(new Error('Pipeline failed'));
      }
    });

    const dest = new Writable({
      write(chunk, encoding, callback) {
        callback();
      }
    });

    const result = await pipelineWithErrorHandling([errorStream, dest]);
    expect(result).toContain('Pipeline failed');
  });

  it('should chain transforms with pipeline', async () => {
    const upper = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
      }
    });

    const exclaim = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk.toString() + '!');
        callback();
      }
    });

    const output = await chainTransformsPipeline(['hello', 'world'], upper, exclaim);
    expect(output).toEqual(['HELLO!', 'WORLD!']);
  });

  it('should process data with filter and transform', async () => {
    const data = [1, 2, 3, 4, 5, 6];
    const filterFn = (n) => n % 2 === 0; // Even numbers
    const transformFn = (n) => n * 2; // Double

    const result = await processDataPipeline(data, filterFn, transformFn);
    expect(result).toEqual([4, 8, 12]);
  });

  it('should demonstrate pipeline error handling superiority', async () => {
    const result = await comparePipeAndPipeline(true);
    expect(result).toBe('error-caught');
  });
});
