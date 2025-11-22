import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 205: Crypto Module - Random Data Generation
 *
 * The crypto module provides cryptographically strong random data generation.
 * This is essential for security-sensitive operations like:
 * - Generating passwords and tokens
 * - Creating encryption keys
 * - Generating session IDs
 * - Creating random salts
 * - Generating UUIDs
 *
 * Key methods:
 * - crypto.randomBytes(size) - generates random bytes (returns Buffer)
 * - crypto.randomUUID() - generates RFC 4122 UUID (v4)
 * - crypto.randomInt(min, max) - generates random integer
 *
 * Important notes:
 * - NEVER use Math.random() for security purposes
 * - crypto random functions use cryptographically secure sources
 * - randomBytes is synchronous and may block if not enough entropy
 * - randomBytes can also be async: randomBytes(size, callback)
 *
 * Security best practices:
 * - Use crypto random functions for all security-sensitive operations
 * - Generate sufficient entropy (e.g., 32 bytes for tokens)
 * - Store tokens securely (hashed in database)
 * - Use appropriate formats (hex, base64url) for different contexts
 *
 * Task: Implement secure random data generation functions
 */

// TODO: Generate random bytes
// Generate specified number of random bytes and return as hex string
export function generateRandomBytes(size) {
  // Your code here
}

// TODO: Generate a secure random token
// Create a 32-byte random token suitable for API keys, session tokens, etc.
// Return as hex string
export function generateSecureToken() {
  // Your code here
}

// TODO: Generate URL-safe random token
// Create random token using base64url encoding (safe for URLs)
// Base64url replaces + with -, / with _, and removes padding =
// Return 32 bytes as base64url string
export function generateURLSafeToken() {
  // Your code here
}

// TODO: Generate a random UUID (v4)
// Use crypto.randomUUID() to generate RFC 4122 UUID
// Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
export function generateUUID() {
  // Your code here
}

// TODO: Generate a random password
// Create a random password with specified length
// Use alphanumeric characters (a-z, A-Z, 0-9)
// Ensure cryptographically secure randomness
export function generateRandomPassword(length) {
  // Your code here
}

// TODO: Generate a random PIN code
// Create a numeric PIN of specified length (e.g., 4 or 6 digits)
// Use crypto.randomInt() for secure random integers
export function generatePIN(length) {
  // Your code here
}

// TODO: Generate a random salt for password hashing
// Create a 16-byte random salt and return as hex
// Used with password hashing to prevent rainbow table attacks
export function generateSalt() {
  // Your code here
}

// TODO: Generate multiple unique tokens
// Create an array of unique random tokens
// Ensure no duplicates (very unlikely with crypto random, but check)
// Return array of hex tokens
export function generateUniqueTokens(count) {
  // Your code here
}

// Tests
describe('Exercise 205: Crypto Random', () => {
  it('should generate random bytes', () => {
    const bytes1 = generateRandomBytes(16);
    const bytes2 = generateRandomBytes(16);

    expect(typeof bytes1).toBe('string');
    expect(bytes1.length).toBe(32); // 16 bytes = 32 hex chars
    expect(bytes1).not.toBe(bytes2); // Should be different

    const bytes32 = generateRandomBytes(32);
    expect(bytes32.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('should generate secure token', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();

    expect(typeof token1).toBe('string');
    expect(token1.length).toBe(64); // 32 bytes = 64 hex chars
    expect(token1).not.toBe(token2);
    expect(/^[0-9a-f]+$/.test(token1)).toBe(true); // Only hex chars
  });

  it('should generate URL-safe token', () => {
    const token = generateURLSafeToken();

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    // Should not contain +, /, or =
    expect(token).not.toContain('+');
    expect(token).not.toContain('/');
    expect(token).not.toContain('=');
    // Should only contain URL-safe characters
    expect(/^[A-Za-z0-9_-]+$/.test(token)).toBe(true);
  });

  it('should generate valid UUID', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();

    expect(typeof uuid1).toBe('string');
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    expect(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid1)).toBe(true);
    expect(uuid1).not.toBe(uuid2);
  });

  it('should generate random password', () => {
    const password1 = generateRandomPassword(12);
    const password2 = generateRandomPassword(12);

    expect(typeof password1).toBe('string');
    expect(password1.length).toBe(12);
    expect(password1).not.toBe(password2);
    // Should only contain alphanumeric
    expect(/^[A-Za-z0-9]+$/.test(password1)).toBe(true);

    const password20 = generateRandomPassword(20);
    expect(password20.length).toBe(20);
  });

  it('should generate random PIN', () => {
    const pin4 = generatePIN(4);
    const pin6 = generatePIN(6);

    expect(typeof pin4).toBe('string');
    expect(pin4.length).toBe(4);
    expect(/^\d+$/.test(pin4)).toBe(true); // Only digits

    expect(pin6.length).toBe(6);
    expect(/^\d+$/.test(pin6)).toBe(true);

    // Generate multiple PINs to ensure randomness
    const pins = new Set();
    for (let i = 0; i < 100; i++) {
      pins.add(generatePIN(4));
    }
    // Should generate many different PINs (not all the same)
    expect(pins.size).toBeGreaterThan(50);
  });

  it('should generate salt', () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();

    expect(typeof salt1).toBe('string');
    expect(salt1.length).toBe(32); // 16 bytes = 32 hex chars
    expect(salt1).not.toBe(salt2);
    expect(/^[0-9a-f]+$/.test(salt1)).toBe(true);
  });

  it('should generate unique tokens', () => {
    const tokens = generateUniqueTokens(10);

    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBe(10);

    // All should be strings
    tokens.forEach(token => {
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    // All should be unique
    const uniqueTokens = new Set(tokens);
    expect(uniqueTokens.size).toBe(10);
  });

  it('should generate cryptographically strong random data', () => {
    // Test for randomness distribution
    const bytes = [];
    for (let i = 0; i < 1000; i++) {
      bytes.push(generateRandomBytes(1));
    }

    // All should be different (or at least most of them)
    const unique = new Set(bytes);
    expect(unique.size).toBeGreaterThan(200); // Expect good distribution
  });
});
