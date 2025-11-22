import { describe, it, expect } from 'vitest';

/**
 * Exercise 199: Buffer Basics
 *
 * Buffers are Node.js's way of handling binary data. They represent fixed-size
 * chunks of memory allocated outside of the V8 heap.
 *
 * Key Buffer creation methods:
 * - Buffer.from(data): Create from string, array, or another buffer
 * - Buffer.alloc(size): Create zero-filled buffer of specified size
 * - Buffer.allocUnsafe(size): Create uninitialized buffer (faster but may contain old data)
 *
 * Common use cases:
 * - Reading/writing files
 * - Network communication
 * - Working with binary protocols
 * - Image/audio/video processing
 *
 * Task: Learn how to create and inspect buffers
 */

// TODO: Create a buffer from a string using default encoding (utf8)
// Example: 'Hello' -> Buffer containing UTF-8 bytes of 'Hello'
export function createBufferFromString(str) {
  // Your code here
}

// TODO: Create a zero-filled buffer of specified size
// Example: size=5 -> Buffer with 5 zeros
export function createZeroBuffer(size) {
  // Your code here
}

// TODO: Create a buffer from an array of bytes
// Example: [72, 101, 108, 108, 111] -> Buffer containing these bytes
export function createBufferFromArray(byteArray) {
  // Your code here
}

// TODO: Get the length (size in bytes) of a buffer
export function getBufferLength(buffer) {
  // Your code here
}

// TODO: Create a buffer filled with a specific byte value
// Example: size=4, fillValue=0xFF -> Buffer with 4 bytes, each 0xFF
export function createFilledBuffer(size, fillValue) {
  // Your code here
}

// TODO: Check if a value is a Buffer instance
export function isBuffer(value) {
  // Your code here
}

// TODO: Copy a buffer (create a new buffer with the same content)
export function copyBuffer(sourceBuffer) {
  // Your code here
}

// TODO: Compare two buffers and return true if they contain the same bytes
export function areBuffersEqual(buffer1, buffer2) {
  // Your code here
}

// Tests
describe('Exercise 199: Buffer Basics', () => {
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
