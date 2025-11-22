import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 205: Crypto Module - Random Data Generation - SOLUTION
 */

export function generateRandomBytes(size) {
  return crypto.randomBytes(size).toString('hex');
}

export function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateURLSafeToken() {
  return crypto.randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateUUID() {
  return crypto.randomUUID();
}

export function generateRandomPassword(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    password += chars[randomIndex];
  }

  return password;
}

export function generatePIN(length) {
  let pin = '';

  for (let i = 0; i < length; i++) {
    pin += crypto.randomInt(0, 10).toString();
  }

  return pin;
}

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function generateUniqueTokens(count) {
  const tokens = new Set();

  while (tokens.size < count) {
    tokens.add(generateSecureToken());
  }

  return Array.from(tokens);
}

// Tests
describe('Exercise 205: Crypto Random - Solution', () => {
  it('should generate random bytes', () => {
    const bytes1 = generateRandomBytes(16);
    const bytes2 = generateRandomBytes(16);

    expect(typeof bytes1).toBe('string');
    expect(bytes1.length).toBe(32);
    expect(bytes1).not.toBe(bytes2);

    const bytes32 = generateRandomBytes(32);
    expect(bytes32.length).toBe(64);
  });

  it('should generate secure token', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();

    expect(typeof token1).toBe('string');
    expect(token1.length).toBe(64);
    expect(token1).not.toBe(token2);
    expect(/^[0-9a-f]+$/.test(token1)).toBe(true);
  });

  it('should generate URL-safe token', () => {
    const token = generateURLSafeToken();

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    expect(token).not.toContain('+');
    expect(token).not.toContain('/');
    expect(token).not.toContain('=');
    expect(/^[A-Za-z0-9_-]+$/.test(token)).toBe(true);
  });

  it('should generate valid UUID', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    expect(typeof uuid1).toBe('string');
    expect(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid1)).toBe(true);
    expect(uuid1).not.toBe(uuid2);
  });

  it('should generate random password', () => {
    const password1 = generateRandomPassword(12);
    const password2 = generateRandomPassword(12);

    expect(typeof password1).toBe('string');
    expect(password1.length).toBe(12);
    expect(password1).not.toBe(password2);
    expect(/^[A-Za-z0-9]+$/.test(password1)).toBe(true);

    const password20 = generateRandomPassword(20);
    expect(password20.length).toBe(20);
  });

  it('should generate random PIN', () => {
    const pin4 = generatePIN(4);
    const pin6 = generatePIN(6);

    expect(typeof pin4).toBe('string');
    expect(pin4.length).toBe(4);
    expect(/^\d+$/.test(pin4)).toBe(true);

    expect(pin6.length).toBe(6);
    expect(/^\d+$/.test(pin6)).toBe(true);

    const pins = new Set();
    for (let i = 0; i < 100; i++) {
      pins.add(generatePIN(4));
    }
    expect(pins.size).toBeGreaterThan(50);
  });

  it('should generate salt', () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();

    expect(typeof salt1).toBe('string');
    expect(salt1.length).toBe(32);
    expect(salt1).not.toBe(salt2);
    expect(/^[0-9a-f]+$/.test(salt1)).toBe(true);
  });

  it('should generate unique tokens', () => {
    const tokens = generateUniqueTokens(10);

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBe(10);

    tokens.forEach(token => {
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    const uniqueTokens = new Set(tokens);
    expect(uniqueTokens.size).toBe(10);
  });

  it('should generate cryptographically strong random data', () => {
    const bytes = [];
    for (let i = 0; i < 1000; i++) {
      bytes.push(generateRandomBytes(1));
    }

    const unique = new Set(bytes);
    expect(unique.size).toBeGreaterThan(200);
  });
});
