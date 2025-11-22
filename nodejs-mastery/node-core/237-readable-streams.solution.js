import { describe, it, expect } from 'vitest';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline';

/**
 * Exercise 237: Readable Streams - SOLUTION
 */

export function createArrayStream(items) {
  let index = 0;

  return new Readable({
    read() {
      if (index < items.length) {
        this.push(items[index]);
        index++;
      } else {
        this.push(null); // Signal end of stream
      }
    }
  });
}

export function readStreamWithEvents(stream) {
  return new Promise((resolve, reject) => {
    let data = '';

    stream.on('data', (chunk) => {
      data += chunk;
    });

    stream.on('end', () => {
      resolve(data);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

export function readStreamFlowing(stream) {
  return new Promise((resolve, reject) => {
    let data = '';

    stream.on('readable', () => {
      let chunk;
      while ((chunk = stream.read()) !== null) {
        data += chunk;
      }
    });

    stream.on('end', () => {
      resolve(data);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

export function readWithPauses(stream, pauseDuration = 10) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk.toString());
      stream.pause();

      setTimeout(() => {
        stream.resume();
      }, pauseDuration);
    });

    stream.on('end', () => {
      resolve(chunks.join(''));
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

export function createNumberStream(start, end) {
  const numbers = [];
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }
  return Readable.from(numbers);
}

export function readStreamWithErrorHandling(stream) {
  return new Promise((resolve) => {
    let data = '';
    let hasError = false;

    stream.on('error', (err) => {
      hasError = true;
      resolve(`Error: ${err.message}`);
    });

    stream.on('data', (chunk) => {
      if (!hasError) {
        data += chunk;
      }
    });

    stream.on('end', () => {
      if (!hasError) {
        resolve(data);
      }
    });
  });
}

export function createLineStream(filePath) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  return new Readable({
    read() {}
  }).wrap(rl);
}

export function countStreamBytes(stream) {
  return new Promise((resolve, reject) => {
    let totalBytes = 0;

    stream.on('data', (chunk) => {
      totalBytes += Buffer.byteLength(chunk);
    });

    stream.on('end', () => {
      resolve(totalBytes);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

// Tests
describe('Exercise 237: Readable Streams - Solution', () => {
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
