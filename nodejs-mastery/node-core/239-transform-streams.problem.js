import { describe, it, expect } from 'vitest';
import { Transform, Readable, pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

/**
 * Exercise 239: Transform Streams - Processing Data in Transit
 *
 * Transform streams are duplex streams that can modify or transform data
 * as it passes through. They're both readable and writable.
 *
 * Key concepts:
 * - _transform(chunk, encoding, callback) - process each chunk
 * - _flush(callback) - final processing before stream ends
 * - push() - send transformed data downstream
 * - Transform streams are both readable and writable
 *
 * Task: Create and use transform streams
 */

// TODO: Create a transform stream that converts text to uppercase
// Transform each chunk to uppercase
export function createUpperCaseTransform() {
  // Your code here
  // Hint: Extend Transform and implement _transform()
}

// TODO: Create a transform stream that filters out empty lines
// Only pass through non-empty lines
export function createLineFilter() {
  // Your code here
  // Hint: Check if chunk is empty before pushing
}

// TODO: Create a transform stream that adds line numbers
// Prefix each line with line number (1, 2, 3, etc.)
export function createLineNumberTransform() {
  let lineNumber = 0;

  return new Transform({
    transform(chunk, encoding, callback) {
      // Your code here
    }
  });
}

// TODO: Create a transform stream that splits text into words
// Split on spaces and emit each word separately
export function createWordSplitter() {
  // Your code here
  // Hint: Split chunk and push each word separately
}

// TODO: Create a transform stream that counts characters
// Add character count to each chunk
export function createCharCounter() {
  // Your code here
  // Hint: Count characters and append to chunk
}

// TODO: Create a transform stream with flush operation
// Collect all chunks and output summary in flush
export function createSummaryTransform() {
  const chunks = [];

  return new Transform({
    transform(chunk, encoding, callback) {
      // Your code here
    },
    flush(callback) {
      // Your code here
      // Hint: Process all collected chunks and push summary
    }
  });
}

// TODO: Create a JSON parser transform stream
// Parse JSON objects from chunks
export function createJsonParserTransform() {
  // Your code here
  // Hint: Try to parse chunk as JSON, handle errors
}

// TODO: Chain multiple transform streams
// Apply multiple transformations in sequence
export async function chainTransforms(input, transforms) {
  // Your code here
  // Hint: Use pipeline to chain transforms
}

// Helper to collect stream output
async function collectStream(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
}

// Tests
describe('Exercise 239: Transform Streams', () => {
  it('should transform to uppercase', async () => {
    const input = Readable.from(['hello', 'world']);
    const transform = createUpperCaseTransform();

    const output = await collectStream(input.pipe(transform));
    expect(output.join('')).toBe('HELLOWORLD');
  });

  it('should filter empty lines', async () => {
    const input = Readable.from(['line1', '', 'line2', '', 'line3']);
    const transform = createLineFilter();

    const output = await collectStream(input.pipe(transform));
    expect(output).toEqual(['line1', 'line2', 'line3']);
  });

  it('should add line numbers', async () => {
    const input = Readable.from(['first', 'second', 'third']);
    const transform = createLineNumberTransform();

    const output = await collectStream(input.pipe(transform));
    expect(output).toEqual(['1: first', '2: second', '3: third']);
  });

  it('should split into words', async () => {
    const input = Readable.from(['hello world', 'foo bar']);
    const transform = createWordSplitter();

    const output = await collectStream(input.pipe(transform));
    expect(output).toEqual(['hello', 'world', 'foo', 'bar']);
  });

  it('should count characters', async () => {
    const input = Readable.from(['hello', 'world']);
    const transform = createCharCounter();

    const output = await collectStream(input.pipe(transform));
    expect(output).toEqual(['hello (5)', 'world (5)']);
  });

  it('should use flush for summary', async () => {
    const input = Readable.from(['a', 'b', 'c']);
    const transform = createSummaryTransform();

    const output = await collectStream(input.pipe(transform));
    expect(output[0]).toContain('Total chunks: 3');
  });

  it('should parse JSON', async () => {
    const input = Readable.from([
      JSON.stringify({ name: 'Alice' }),
      JSON.stringify({ name: 'Bob' })
    ]);
    const transform = createJsonParserTransform();

    const output = await collectStream(input.pipe(transform));
    expect(output).toEqual([
      { name: 'Alice' },
      { name: 'Bob' }
    ]);
  });

  it('should chain multiple transforms', async () => {
    const input = ['hello world', 'foo bar'];
    const transforms = [
      createUpperCaseTransform(),
      createWordSplitter()
    ];

    const output = await chainTransforms(input, transforms);
    expect(output).toEqual(['HELLO', 'WORLD', 'FOO', 'BAR']);
  });
});
