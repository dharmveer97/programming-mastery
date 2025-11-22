import { describe, it, expect } from 'vitest';
import { Readable, Writable, Transform, pipeline } from 'stream';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const pipelineAsync = promisify(pipeline);

/**
 * Exercise 240: Pipe and Pipeline - SOLUTION
 */

export function simplePipe(source, destination) {
  source.pipe(destination);
}

export function simplePipeline(source, transforms, destination) {
  return new Promise((resolve, reject) => {
    pipeline(
      source,
      ...transforms,
      destination,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

export function copyFileWithPipe(sourcePath, destPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(sourcePath);
    const writeStream = fs.createWriteStream(destPath);

    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);

    readStream.pipe(writeStream);
  });
}

export async function transformFile(sourcePath, destPath) {
  const uppercase = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().toUpperCase());
      callback();
    }
  });

  await pipelineAsync(
    fs.createReadStream(sourcePath),
    uppercase,
    fs.createWriteStream(destPath)
  );
}

export async function pipelineWithErrorHandling(streams) {
  try {
    await pipelineAsync(...streams);
    return 'success';
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

export function chainTransformsPipeline(input, ...transforms) {
  return new Promise((resolve, reject) => {
    const output = [];

    const writable = new Writable({
      write(chunk, encoding, callback) {
        output.push(chunk.toString());
        callback();
      }
    });

    pipeline(
      Readable.from(input),
      ...transforms,
      writable,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      }
    );
  });
}

export async function processDataPipeline(data, filterFn, transformFn) {
  const output = [];

  const filterTransform = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      if (filterFn(chunk)) {
        this.push(chunk);
      }
      callback();
    }
  });

  const mapTransform = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      this.push(transformFn(chunk));
      callback();
    }
  });

  await pipelineAsync(
    Readable.from(data),
    filterTransform,
    mapTransform,
    new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        output.push(chunk);
        callback();
      }
    })
  );

  return output;
}

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

    pipeline(source, dest, (err) => {
      if (err) {
        resolve('error-caught');
      } else {
        resolve('no-error');
      }
    });
  });
}

// Tests
describe('Exercise 240: Pipe and Pipeline - Solution', () => {
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
