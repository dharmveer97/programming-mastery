import { describe, it, expect } from 'vitest';

/**
 * Exercise 201: Buffer Encoding - SOLUTION
 */

export function stringToBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

export function base64ToString(base64Str) {
  return Buffer.from(base64Str, 'base64').toString('utf8');
}

export function stringToHex(str) {
  return Buffer.from(str, 'utf8').toString('hex');
}

export function hexToString(hexStr) {
  return Buffer.from(hexStr, 'hex').toString('utf8');
}

export function bufferToDataURL(buffer, mimeType) {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

export function dataURLToBuffer(dataURL) {
  // Check if it matches the data URL format
  const matches = dataURL.match(/^data:([^;]+);base64,(.+)$/);

  if (!matches) {
    return null;
  }

  const base64Data = matches[2];
  return Buffer.from(base64Data, 'base64');
}

export function convertEncoding(str, fromEncoding, toEncoding) {
  const buffer = Buffer.from(str, fromEncoding);
  return buffer.toString(toEncoding);
}

export function getByteLength(str, encoding = 'utf8') {
  return Buffer.byteLength(str, encoding);
}

// Tests
describe('Exercise 201: Buffer Encoding - Solution', () => {
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
