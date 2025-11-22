import { describe, it, expect } from 'vitest';

/**
 * Exercise 201: Buffer Encoding
 *
 * Buffers can be encoded/decoded in multiple formats:
 * - 'utf8': Default, standard text encoding
 * - 'ascii': 7-bit ASCII
 * - 'base64': Base64 encoding (used in emails, data URLs)
 * - 'hex': Hexadecimal encoding (2 chars per byte)
 * - 'latin1' / 'binary': Raw binary data
 *
 * Common use cases:
 * - base64: Encoding binary data for transmission (images, files)
 * - hex: Displaying binary data, hashes, crypto
 * - utf8: Text processing
 *
 * Creating with encoding:
 * - Buffer.from(string, encoding)
 * - buffer.toString(encoding)
 *
 * Task: Master encoding conversions for different use cases
 */

// TODO: Convert a string to base64 encoding
// Example: 'Hello World' -> 'SGVsbG8gV29ybGQ='
export function stringToBase64(str) {
  // Your code here
}

// TODO: Convert base64 string back to regular string
// Example: 'SGVsbG8gV29ybGQ=' -> 'Hello World'
export function base64ToString(base64Str) {
  // Your code here
}

// TODO: Convert a string to hexadecimal encoding
// Example: 'Hello' -> '48656c6c6f'
export function stringToHex(str) {
  // Your code here
}

// TODO: Convert hex string back to regular string
// Example: '48656c6c6f' -> 'Hello'
export function hexToString(hexStr) {
  // Your code here
}

// TODO: Convert buffer to a data URL (useful for embedding images in HTML/CSS)
// Format: 'data:<mimeType>;base64,<base64Data>'
// Example: Buffer, 'image/png' -> 'data:image/png;base64,<encoded>'
export function bufferToDataURL(buffer, mimeType) {
  // Your code here
}

// TODO: Extract buffer from a data URL
// Return null if invalid format
export function dataURLToBuffer(dataURL) {
  // Your code here
}

// TODO: Convert between different encodings
// Example: 'Hello' from 'utf8' to 'base64'
export function convertEncoding(str, fromEncoding, toEncoding) {
  // Your code here
}

// TODO: Calculate the byte length of a string in different encodings
// Note: Different encodings use different numbers of bytes per character
export function getByteLength(str, encoding = 'utf8') {
  // Your code here
}

// Tests
describe('Exercise 201: Buffer Encoding', () => {
  it('should convert string to base64', () => {
    expect(stringToBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
    expect(stringToBase64('Node.js')).toBe('Tm9kZS5qcw==');
    expect(stringToBase64('A')).toBe('QQ==');
  });

  it('should convert base64 to string', () => {
    expect(base64ToString('SGVsbG8gV29ybGQ=')).toBe('Hello World');
    expect(base64ToString('Tm9kZS5qcw==')).toBe('Node.js');
    expect(base64ToString('QQ==')).toBe('A');
  });

  it('should convert string to hex', () => {
    expect(stringToHex('Hello')).toBe('48656c6c6f');
    expect(stringToHex('ABC')).toBe('414243');
    expect(stringToHex('123')).toBe('313233');
  });

  it('should convert hex to string', () => {
    expect(hexToString('48656c6c6f')).toBe('Hello');
    expect(hexToString('414243')).toBe('ABC');
    expect(hexToString('313233')).toBe('123');
  });

  it('should convert buffer to data URL', () => {
    const buffer = Buffer.from('Hello');
    const dataURL = bufferToDataURL(buffer, 'text/plain');

    expect(dataURL).toBe('data:text/plain;base64,SGVsbG8=');

    const imageBuffer = Buffer.from([0xFF, 0xD8, 0xFF]); // JPEG header
    const imageDataURL = bufferToDataURL(imageBuffer, 'image/jpeg');
    expect(imageDataURL).toBe('data:image/jpeg;base64,/9j/');
  });

  it('should extract buffer from data URL', () => {
    const dataURL = 'data:text/plain;base64,SGVsbG8=';
    const buffer = dataURLToBuffer(dataURL);

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.toString()).toBe('Hello');

    // Test invalid format
    expect(dataURLToBuffer('not-a-data-url')).toBeNull();
    expect(dataURLToBuffer('data:text/plain,notbase64')).toBeNull();
  });

  it('should convert between encodings', () => {
    // UTF-8 to Base64
    expect(convertEncoding('Hello', 'utf8', 'base64')).toBe('SGVsbG8=');

    // UTF-8 to Hex
    expect(convertEncoding('Hi', 'utf8', 'hex')).toBe('4869');

    // Base64 to UTF-8
    expect(convertEncoding('SGVsbG8=', 'base64', 'utf8')).toBe('Hello');

    // Hex to UTF-8
    expect(convertEncoding('4869', 'hex', 'utf8')).toBe('Hi');
  });

  it('should calculate byte length for different encodings', () => {
    // ASCII characters are 1 byte in UTF-8
    expect(getByteLength('Hello', 'utf8')).toBe(5);
    expect(getByteLength('Hello', 'ascii')).toBe(5);

    // Emojis are multiple bytes in UTF-8
    expect(getByteLength('👋', 'utf8')).toBe(4);

    // Base64 encoding of 'Hello' -> 'SGVsbG8='
    expect(getByteLength('SGVsbG8=', 'base64')).toBe(5);

    // Hex encoding: 2 characters = 1 byte
    expect(getByteLength('48656c6c6f', 'hex')).toBe(5);
  });
});
