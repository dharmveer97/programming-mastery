import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 202: Crypto Module - Hashing - SOLUTION
 */

export function createMD5Hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

export function createSHA256Hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function createSHA512Hash(data) {
  return crypto.createHash('sha512').update(data).digest('base64');
}

export function hashPasswordWithSalt(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export function hashBuffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function verifyHash(data, hash) {
  const computedHash = createSHA256Hash(data);
  return computedHash === hash;
}

export function generatePasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
  return { salt, hash };
}

export function verifyPassword(password, storedHash, storedSalt) {
  const hash = crypto.createHash('sha256').update(password + storedSalt).digest('hex');
  return hash === storedHash;
}

// Tests
describe('Exercise 202: Crypto Hashing - Solution', () => {
  it('should create MD5 hash', () => {
    const hash = createMD5Hash('hello');
    expect(hash).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(hash.length).toBe(32);
  });

  it('should create SHA256 hash', () => {
    const hash = createSHA256Hash('hello');
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    expect(hash.length).toBe(64);
  });

  it('should create SHA512 hash in base64', () => {
    const hash = createSHA512Hash('hello');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(88);
  });

  it('should hash password with salt', () => {
    const hash1 = hashPasswordWithSalt('password123', 'randomsalt');
    const hash2 = hashPasswordWithSalt('password123', 'randomsalt');
    const hash3 = hashPasswordWithSalt('password123', 'differentsalt');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBe(64);
  });

  it('should hash buffer data', () => {
    const buffer = Buffer.from('hello world');
    const hash = hashBuffer(buffer);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
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
    expect(result.salt.length).toBe(32);
    expect(result.hash.length).toBe(64);

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
