import { describe, it, expect } from 'vitest';

/**
 * Exercise 199: Buffer Basics - SOLUTION
 */

export function createBufferFromString(str) {
  return Buffer.from(str);
}

export function createZeroBuffer(size) {
  return Buffer.alloc(size);
}

export function createBufferFromArray(byteArray) {
  return Buffer.from(byteArray);
}

export function getBufferLength(buffer) {
  return buffer.length;
}

export function createFilledBuffer(size, fillValue) {
  return Buffer.alloc(size, fillValue);
}

export function isBuffer(value) {
  return Buffer.isBuffer(value);
}

export function copyBuffer(sourceBuffer) {
  // Create a new buffer and copy the content
  return Buffer.from(sourceBuffer);
}

export function areBuffersEqual(buffer1, buffer2) {
  return buffer1.equals(buffer2);
}

// Tests
describe('Exercise 199: Buffer Basics - Solution', () => {
  it('should create buffer from string', () => {
    const buffer = createBufferFromString('Hello');
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.toString()).toBe('Hello');
    expect(buffer.length).toBe(5);
  });

  it('should create zero-filled buffer', () => {
    const buffer = createZeroBuffer(10);
    expect(buffer.length).toBe(10);
    expect(buffer.every(byte => byte === 0)).toBe(true);
  });

  it('should create buffer from byte array', () => {
    const buffer = createBufferFromArray([72, 101, 108, 108, 111]);
    expect(buffer.toString()).toBe('Hello');
  });

  it('should get buffer length', () => {
    const buffer = Buffer.from('Test');
    expect(getBufferLength(buffer)).toBe(4);

    const emptyBuffer = Buffer.alloc(0);
    expect(getBufferLength(emptyBuffer)).toBe(0);
  });

  it('should create filled buffer', () => {
    const buffer = createFilledBuffer(5, 0x41); // ASCII 'A'
    expect(buffer.length).toBe(5);
    expect(buffer.toString()).toBe('AAAAA');
  });

  it('should check if value is a buffer', () => {
    expect(isBuffer(Buffer.from('test'))).toBe(true);
    expect(isBuffer(Buffer.alloc(10))).toBe(true);
    expect(isBuffer('string')).toBe(false);
    expect(isBuffer([1, 2, 3])).toBe(false);
    expect(isBuffer({})).toBe(false);
  });

  it('should copy a buffer', () => {
    const original = Buffer.from('Hello World');
    const copy = copyBuffer(original);

    expect(copy).toBeInstanceOf(Buffer);
    expect(copy.toString()).toBe('Hello World');
    expect(copy).not.toBe(original); // Different objects
    expect(copy.equals(original)).toBe(true); // Same content
  });

  it('should compare buffers for equality', () => {
    const buffer1 = Buffer.from('Hello');
    const buffer2 = Buffer.from('Hello');
    const buffer3 = Buffer.from('World');

    expect(areBuffersEqual(buffer1, buffer2)).toBe(true);
    expect(areBuffersEqual(buffer1, buffer3)).toBe(false);
  });
});
