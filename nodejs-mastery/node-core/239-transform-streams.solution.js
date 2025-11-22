import { describe, it, expect } from 'vitest';
import { Transform, Readable, pipeline } from 'stream';
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline);

/**
 * Exercise 239: Transform Streams - SOLUTION
 */

export function createUpperCaseTransform() {
  return new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  });
}

export function createLineFilter() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const line = chunk.toString();
      if (line.trim() !== '') {
        this.push(line);
      }
      callback();
    }
  });
}

export function createLineNumberTransform() {
  let lineNumber = 0;

  return new Transform({
    transform(chunk, encoding, callback) {
      lineNumber++;
      this.push(`${lineNumber}: ${chunk}`);
      callback();
    }
  });
}

export function createWordSplitter() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const words = chunk.toString().split(' ');
      words.forEach(word => {
        if (word) {
          this.push(word);
        }
      });
      callback();
    }
  });
}

export function createCharCounter() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const text = chunk.toString();
      this.push(`${text} (${text.length})`);
      callback();
    }
  });
}

export function createSummaryTransform() {
  const chunks = [];

  return new Transform({
    transform(chunk, encoding, callback) {
      chunks.push(chunk.toString());
      callback();
    },
    flush(callback) {
      const summary = `Total chunks: ${chunks.length}, Content: ${chunks.join(', ')}`;
      this.push(summary);
      callback();
    }
  });
}

export function createJsonParserTransform() {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      try {
        const obj = JSON.parse(chunk.toString());
        this.push(obj);
        callback();
      } catch (err) {
        callback(err);
      }
    }
  });
}

export async function chainTransforms(input, transforms) {
  const readable = Readable.from(input);
  const chunks = [];

  await pipelineAsync(
    readable,
    ...transforms,
    new Transform({
      transform(chunk, encoding, callback) {
        chunks.push(chunk.toString());
        callback();
      }
    })
  );

  return chunks;
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
describe('Exercise 239: Transform Streams - Solution', () => {
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
