import { describe, it, expect } from 'vitest';
import { Writable, Readable } from 'stream';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 238: Writable Streams - SOLUTION
 */

export function createCollectorStream() {
  const data = [];

  const stream = new Writable({
    write(chunk, encoding, callback) {
      data.push(chunk.toString());
      callback();
    }
  });

  stream.getData = () => data;
  return stream;
}

export function writeToStream(stream, items) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('finish', resolve);

    items.forEach(item => {
      stream.write(item);
    });

    stream.end();
  });
}

export function createUppercaseWriter() {
  const data = [];

  const stream = new Writable({
    write(chunk, encoding, callback) {
      data.push(chunk.toString().toUpperCase());
      callback();
    }
  });

  stream.getData = () => data;
  return stream;
}

export function writeWithBackpressure(stream, items) {
  return new Promise((resolve, reject) => {
    let index = 0;

    stream.on('error', reject);
    stream.on('finish', resolve);

    function writeNext() {
      let ok = true;

      while (index < items.length && ok) {
        ok = stream.write(items[index]);
        index++;
      }

      if (index < items.length) {
        // Backpressure - wait for drain
        stream.once('drain', writeNext);
      } else {
        stream.end();
      }
    }

    writeNext();
  });
}

export function createFileWriter(filePath) {
  return fs.createWriteStream(filePath);
}

export function writeWithErrorHandling(stream, data) {
  return new Promise((resolve) => {
    stream.on('error', (err) => {
      resolve(`Error: ${err.message}`);
    });

    stream.on('finish', () => {
      resolve('success');
    });

    stream.write(data);
    stream.end();
  });
}

export function createStreamWithWaterMark(highWaterMark = 16) {
  let drainCount = 0;

  const stream = new Writable({
    highWaterMark,
    write(chunk, encoding, callback) {
      // Simulate async write
      setImmediate(callback);
    }
  });

  stream.on('drain', () => {
    drainCount++;
  });

  stream.getDrainCount = () => drainCount;
  return stream;
}

export function writeWithCork(stream, items) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('finish', resolve);

    stream.cork();

    items.forEach(item => {
      stream.write(item);
    });

    stream.uncork();
    stream.end();
  });
}

// Tests
describe('Exercise 238: Writable Streams - Solution', () => {
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
