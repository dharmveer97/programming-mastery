import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 202: Crypto Module - Hashing
 *
 * The crypto module provides cryptographic functionality including hashing.
 * Hashing creates a fixed-size string (hash) from any input data.
 * Hashes are one-way functions - you cannot reverse them to get the original data.
 *
 * Key concepts:
 * - crypto.createHash(algorithm) - creates a hash object
 * - hash.update(data) - adds data to be hashed
 * - hash.digest(encoding) - returns the hash ('hex', 'base64', etc.)
 *
 * Common algorithms:
 * - MD5 - Fast but NOT secure (128-bit, avoid for security)
 * - SHA256 - Secure, commonly used (256-bit)
 * - SHA512 - More secure (512-bit)
 *
 * Security best practices:
 * - Use SHA256 or SHA512 for security purposes
 * - Add salt to password hashes to prevent rainbow table attacks
 * - Consider using bcrypt or argon2 for password hashing in production
 *
 * Task: Implement various hashing functions
 */

// TODO: Create an MD5 hash of the input string
// Return the hash as a hexadecimal string
// Note: MD5 is NOT secure, use only for non-security purposes
export function createMD5Hash(data) {
  // Your code here
}

// TODO: Create a SHA256 hash of the input string
// Return the hash as a hexadecimal string
// SHA256 is secure and commonly used
export function createSHA256Hash(data) {
  // Your code here
}

// TODO: Create a SHA512 hash of the input string
// Return the hash as a base64 string
// SHA512 provides more security than SHA256
export function createSHA512Hash(data) {
  // Your code here
}

// TODO: Hash a password with a salt
// Combine password and salt, then hash with SHA256
// Return the hash as a hexadecimal string
// This makes rainbow table attacks much harder
export function hashPasswordWithSalt(password, salt) {
  // Your code here
}

// TODO: Create a hash of file-like data (Buffer)
// Accept a Buffer and return its SHA256 hash in hex
export function hashBuffer(buffer) {
  // Your code here
}

// TODO: Verify if data matches a hash
// Return true if hashing the data produces the same hash
// Use SHA256 for comparison
export function verifyHash(data, hash) {
  // Your code here
}

// TODO: Generate a simple password hash with auto-generated salt
// Create a random 16-byte salt, combine with password, hash with SHA256
// Return an object with { salt: 'hex-string', hash: 'hex-string' }
// In production, use bcrypt or argon2 instead
export function generatePasswordHash(password) {
  // Your code here
}

// TODO: Verify a password against a stored hash and salt
// Use the provided salt, hash the password, compare with stored hash
// Return true if they match
export function verifyPassword(password, storedHash, storedSalt) {
  // Your code here
}

// Tests
describe('Exercise 202: Crypto Hashing', () => {
  it('should create MD5 hash', () => {
    const hash = createMD5Hash('hello');
    expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(hash.length).toBe(32); // MD5 is 128 bits = 32 hex chars
  });

  it('should create SHA256 hash', () => {
    const hash = createSHA256Hash('hello');
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    expect(hash.length).toBe(64); // SHA256 is 256 bits = 64 hex chars
  });

  it('should create SHA512 hash in base64', () => {
    const hash = createSHA512Hash('hello');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
    // SHA512 in base64 is 88 characters
    expect(hash.length).toBe(88);
  });

  it('should hash password with salt', () => {
    const hash1 = hashPasswordWithSalt('password123', 'randomsalt');
    const hash2 = hashPasswordWithSalt('password123', 'randomsalt');
    const hash3 = hashPasswordWithSalt('password123', 'differentsalt');

    // Same password + salt should produce same hash
    expect(hash1).toBe(hash2);
    // Different salt should produce different hash
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBe(64); // SHA256 hex
  });

  it('should hash buffer data', () => {
    const buffer = Buffer.from('hello world');
    const hash = hashBuffer(buffer);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64); // SHA256 hex
    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('should verify hash correctly', () => {
    const data = 'test data';
    const hash = createSHA256Hash(data);

    expect(verifyHash(data, hash)).toBe(true);
    expect(verifyHash('wrong data', hash)).toBe(false);
  });

  it('should generate password hash with salt', () => {
    const result = generatePasswordHash('mypassword');

    expect(result).toHaveProperty('salt');
    expect(result).toHaveProperty('hash');
    expect(result.salt.length).toBe(32); // 16 bytes = 32 hex chars
    expect(result.hash.length).toBe(64); // SHA256 = 64 hex chars

    // Different calls should produce different salts
    const result2 = generatePasswordHash('mypassword');
    expect(result.salt).not.toBe(result2.salt);
    expect(result.hash).not.toBe(result2.hash);
  });

  it('should verify password correctly', () => {
    const password = 'secretpass';
    const { salt, hash } = generatePasswordHash(password);

    expect(verifyPassword(password, hash, salt)).toBe(true);
    expect(verifyPassword('wrongpass', hash, salt)).toBe(false);
    expect(verifyPassword(password, hash, 'wrongsalt')).toBe(false);
  });
});
