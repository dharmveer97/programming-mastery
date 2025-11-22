import { describe, it, expect } from 'vitest';

/**
 * Exercise 200: Buffer Operations
 *
 * Once you have buffers, you need to read, write, and manipulate them.
 *
 * Key operations:
 * - toString(encoding): Convert buffer to string
 * - slice(start, end): Extract a portion (shares memory with original)
 * - subarray(start, end): Like slice, preferred in modern code
 * - Buffer.concat(list): Combine multiple buffers
 * - write(string, offset, encoding): Write string into buffer
 * - copy(target, targetStart, sourceStart, sourceEnd): Copy buffer data
 *
 * Reading/Writing bytes:
 * - buffer[index]: Read byte at index
 * - buffer[index] = value: Write byte at index
 *
 * Task: Master common buffer operations
 */

// TODO: Convert a buffer to a string using specified encoding
// Default encoding should be 'utf8'
export function bufferToString(buffer, encoding = 'utf8') {
  // Your code here
}

// TODO: Extract a portion of a buffer (return a new view of the same memory)
// Example: buffer contains 'Hello World', start=0, end=5 -> buffer containing 'Hello'
export function sliceBuffer(buffer, start, end) {
  // Your code here
}

// TODO: Concatenate multiple buffers into one
// Example: [Buffer.from('Hello'), Buffer.from(' '), Buffer.from('World')] -> Buffer containing 'Hello World'
export function concatenateBuffers(bufferArray) {
  // Your code here
}

// TODO: Write a string into an existing buffer at a specific offset
// Return the number of bytes written
export function writeStringToBuffer(buffer, string, offset = 0) {
  // Your code here
}

// TODO: Read a single byte from a buffer at a specific index
export function readByte(buffer, index) {
  // Your code here
}

// TODO: Write a single byte to a buffer at a specific index
export function writeByte(buffer, index, value) {
  buffer[index] = value;
  return buffer;
}

// TODO: Reverse the bytes in a buffer (modify in place)
// Example: Buffer containing [1, 2, 3, 4] -> [4, 3, 2, 1]
export function reverseBuffer(buffer) {
  // Your code here
}

// TODO: Find the index of the first occurrence of a value (byte or string) in a buffer
// Return -1 if not found
export function findInBuffer(buffer, value) {
  // Your code here
}

// Tests
describe('Exercise 200: Buffer Operations', () => {
  it('should convert buffer to string', () => {
    const buffer = Buffer.from('Hello World');
    expect(bufferToString(buffer)).toBe('Hello World');
    expect(bufferToString(buffer, 'utf8')).toBe('Hello World');
  });

  it('should slice a buffer', () => {
    const buffer = Buffer.from('Hello World');
    const sliced = sliceBuffer(buffer, 0, 5);

    expect(sliced.toString()).toBe('Hello');
    expect(sliceBuffer(buffer, 6, 11).toString()).toBe('World');
    expect(sliceBuffer(buffer, 6).toString()).toBe('World');
  });

  it('should concatenate buffers', () => {
    const buffers = [
      Buffer.from('Hello'),
      Buffer.from(' '),
      Buffer.from('World')
    ];

    const result = concatenateBuffers(buffers);
    expect(result.toString()).toBe('Hello World');
  });

  it('should write string to buffer', () => {
    const buffer = Buffer.alloc(20);
    const bytesWritten = writeStringToBuffer(buffer, 'Hello', 0);

    expect(bytesWritten).toBe(5);
    expect(buffer.toString('utf8', 0, 5)).toBe('Hello');
  });

  it('should read byte from buffer', () => {
    const buffer = Buffer.from([72, 101, 108, 108, 111]); // 'Hello'
    expect(readByte(buffer, 0)).toBe(72); // 'H'
    expect(readByte(buffer, 4)).toBe(111); // 'o'
  });

  it('should write byte to buffer', () => {
    const buffer = Buffer.from('Hello');
    writeByte(buffer, 0, 74); // Change 'H' to 'J'

    expect(buffer.toString()).toBe('Jello');
  });

  it('should reverse buffer in place', () => {
    const buffer = Buffer.from([1, 2, 3, 4, 5]);
    reverseBuffer(buffer);

    expect(Array.from(buffer)).toEqual([5, 4, 3, 2, 1]);

    const textBuffer = Buffer.from('Hello');
    reverseBuffer(textBuffer);
    expect(textBuffer.toString()).toBe('olleH');
  });

  it('should find value in buffer', () => {
    const buffer = Buffer.from('Hello World');

    expect(findInBuffer(buffer, 'World')).toBe(6);
    expect(findInBuffer(buffer, 'Hello')).toBe(0);
    expect(findInBuffer(buffer, 111)).toBe(4); // 'o'
    expect(findInBuffer(buffer, 'xyz')).toBe(-1);
  });
});
