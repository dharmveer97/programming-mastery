import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 204: Crypto Module - Encryption and Decryption
 *
 * Encryption allows you to convert data into a format that can only be read
 * with the correct key. Unlike hashing, encryption is reversible (two-way).
 *
 * Key concepts:
 * - crypto.createCipheriv(algorithm, key, iv) - creates cipher for encryption
 * - crypto.createDecipheriv(algorithm, key, iv) - creates decipher for decryption
 * - IV (Initialization Vector) - random value for added security
 * - Algorithm - AES-256-CBC, AES-256-GCM are common
 *
 * Important notes:
 * - createCipher/createDecipher are deprecated, use createCipheriv/createDecipheriv
 * - Always use an IV (initialization vector) for security
 * - IV should be random and unique for each encryption
 * - IV doesn't need to be secret, but must be available for decryption
 * - Key must be kept secret and be the correct length for the algorithm
 *
 * Common algorithms:
 * - aes-256-cbc - AES with 256-bit key, CBC mode (requires 16-byte IV)
 * - aes-256-gcm - AES with 256-bit key, GCM mode (authenticated encryption)
 *
 * Security best practices:
 * - Use AES-256-GCM for authenticated encryption (prevents tampering)
 * - Never reuse IVs with the same key
 * - Store IV with encrypted data (it's not secret)
 * - Use strong, random keys of the correct length
 *
 * Task: Implement encryption and decryption functions
 */

// TODO: Encrypt text using AES-256-CBC
// Generate random 16-byte IV, encrypt data, return { encrypted, iv } in hex
// Key should be 32 bytes for AES-256
export function encryptAES256CBC(text, key) {
  // Your code here
}

// TODO: Decrypt text using AES-256-CBC
// Use provided IV and key to decrypt the encrypted data
// Return the original text
export function decryptAES256CBC(encrypted, iv, key) {
  // Your code here
}

// TODO: Encrypt with AES-256-GCM (provides authentication)
// GCM mode provides both encryption and authentication
// Return { encrypted, iv, authTag } all in hex format
// Auth tag prevents tampering with encrypted data
export function encryptAES256GCM(text, key) {
  // Your code here
}

// TODO: Decrypt with AES-256-GCM
// Verify auth tag and decrypt data
// Throw error if auth tag is invalid (data was tampered)
// Return the original text
export function decryptAES256GCM(encrypted, iv, authTag, key) {
  // Your code here
}

// TODO: Create a complete encryption helper
// Generate a random 32-byte key, encrypt the data with AES-256-CBC
// Return { encrypted, iv, key } all in hex format
// Useful when you need to generate a new key for encryption
export function encryptWithNewKey(text) {
  // Your code here
}

// TODO: Decrypt data encrypted with encryptWithNewKey
// Accept the complete object { encrypted, iv, key }
// Return the original text
export function decryptWithKey(encryptedData) {
  // Your code here
}

// TODO: Encrypt JSON data
// Stringify the object, encrypt with AES-256-CBC
// Return { encrypted, iv } in hex format
// Common pattern for encrypting structured data
export function encryptJSON(data, key) {
  // Your code here
}

// TODO: Decrypt and parse JSON data
// Decrypt the data and parse back to original object
// Return the parsed object
export function decryptJSON(encrypted, iv, key) {
  // Your code here
}

// Tests
describe('Exercise 204: Crypto Encryption', () => {
  // 32 bytes for AES-256
  const key = crypto.randomBytes(32);

  it('should encrypt and decrypt with AES-256-CBC', () => {
    const text = 'Hello, World!';
    const { encrypted, iv } = encryptAES256CBC(text, key);

    expect(typeof encrypted).toBe('string');
    expect(typeof iv).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
    expect(iv.length).toBe(32); // 16 bytes = 32 hex chars

    // Decrypt and verify
    const decrypted = decryptAES256CBC(encrypted, iv, key);
    expect(decrypted).toBe(text);

    // Different IVs should produce different encrypted output
    const { encrypted: encrypted2 } = encryptAES256CBC(text, key);
    expect(encrypted).not.toBe(encrypted2);
  });

  it('should fail to decrypt with wrong key', () => {
    const text = 'Secret message';
    const { encrypted, iv } = encryptAES256CBC(text, key);

    const wrongKey = crypto.randomBytes(32);
    expect(() => {
      decryptAES256CBC(encrypted, iv, wrongKey);
    }).toThrow();
  });

  it('should encrypt and decrypt with AES-256-GCM', () => {
    const text = 'Authenticated message';
    const { encrypted, iv, authTag } = encryptAES256GCM(text, key);

    expect(typeof encrypted).toBe('string');
    expect(typeof iv).toBe('string');
    expect(typeof authTag).toBe('string');
    expect(authTag.length).toBe(32); // 16 bytes = 32 hex chars

    // Decrypt and verify
    const decrypted = decryptAES256GCM(encrypted, iv, authTag, key);
    expect(decrypted).toBe(text);
  });

  it('should detect tampering with GCM auth tag', () => {
    const text = 'Important data';
    const { encrypted, iv, authTag } = encryptAES256GCM(text, key);

    // Try to decrypt with wrong auth tag
    const wrongAuthTag = authTag.replace(/./g, '0');
    expect(() => {
      decryptAES256GCM(encrypted, iv, wrongAuthTag, key);
    }).toThrow();

    // Try to decrypt tampered ciphertext
    const tampered = encrypted.replace(/./g, 'f');
    expect(() => {
      decryptAES256GCM(tampered, iv, authTag, key);
    }).toThrow();
  });

  it('should encrypt with new key and decrypt', () => {
    const text = 'Secret data';
    const encryptedData = encryptWithNewKey(text);

    expect(encryptedData).toHaveProperty('encrypted');
    expect(encryptedData).toHaveProperty('iv');
    expect(encryptedData).toHaveProperty('key');
    expect(encryptedData.key.length).toBe(64); // 32 bytes = 64 hex chars

    const decrypted = decryptWithKey(encryptedData);
    expect(decrypted).toBe(text);
  });

  it('should encrypt and decrypt JSON data', () => {
    const data = {
      user: 'john',
      email: 'john@example.com',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    };

    const { encrypted, iv } = encryptJSON(data, key);

    expect(typeof encrypted).toBe('string');
    expect(typeof iv).toBe('string');

    const decrypted = decryptJSON(encrypted, iv, key);
    expect(decrypted).toEqual(data);
  });

  it('should handle special characters in encryption', () => {
    const text = 'Special chars: émojis 🚀 symbols @#$%^&*()';
    const { encrypted, iv } = encryptAES256CBC(text, key);
    const decrypted = decryptAES256CBC(encrypted, iv, key);
    expect(decrypted).toBe(text);
  });

  it('should handle empty strings', () => {
    const text = '';
    const { encrypted, iv } = encryptAES256CBC(text, key);
    const decrypted = decryptAES256CBC(encrypted, iv, key);
    expect(decrypted).toBe(text);
  });

  it('should handle long texts', () => {
    const text = 'A'.repeat(10000);
    const { encrypted, iv } = encryptAES256CBC(text, key);
    const decrypted = decryptAES256CBC(encrypted, iv, key);
    expect(decrypted).toBe(text);
  });
});
