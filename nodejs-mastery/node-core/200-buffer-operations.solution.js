import { describe, it, expect } from 'vitest';

/**
 * Exercise 200: Buffer Operations - SOLUTION
 */

export function bufferToString(buffer, encoding = 'utf8') {
  return buffer.toString(encoding);
}

export function sliceBuffer(buffer, start, end) {
  return buffer.subarray(start, end);
}

export function concatenateBuffers(bufferArray) {
  return Buffer.concat(bufferArray);
}

export function writeStringToBuffer(buffer, string, offset = 0) {
  return buffer.write(string, offset);
}

export function readByte(buffer, index) {
  return buffer[index];
}

export function writeByte(buffer, index, value) {
  buffer[index] = value;
  return buffer;
}

export function reverseBuffer(buffer) {
  // Reverse in place using two pointers
  let left = 0;
  let right = buffer.length - 1;

  while (left < right) {
    // Swap bytes
    const temp = buffer[left];
    buffer[left] = buffer[right];
    buffer[right] = temp;

    left++;
    right--;
  }

  return buffer;
}

export function findInBuffer(buffer, value) {
  return buffer.indexOf(value);
}

// Tests
describe('Exercise 200: Buffer Operations - Solution', () => {
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
