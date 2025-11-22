import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 204: Crypto Module - Encryption and Decryption - SOLUTION
 */

export function encryptAES256CBC(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted,
    iv: iv.toString('hex')
  };
}

export function decryptAES256CBC(encrypted, iv, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(iv, 'hex')
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function encryptAES256GCM(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decryptAES256GCM(encrypted, iv, authTag, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function encryptWithNewKey(text) {
  const key = crypto.randomBytes(32);
  const { encrypted, iv } = encryptAES256CBC(text, key);

  return {
    encrypted,
    iv,
    key: key.toString('hex')
  };
}

export function decryptWithKey(encryptedData) {
  const { encrypted, iv, key } = encryptedData;
  return decryptAES256CBC(encrypted, iv, Buffer.from(key, 'hex'));
}

export function encryptJSON(data, key) {
  const text = JSON.stringify(data);
  return encryptAES256CBC(text, key);
}

export function decryptJSON(encrypted, iv, key) {
  const text = decryptAES256CBC(encrypted, iv, key);
  return JSON.parse(text);
}

// Tests
describe('Exercise 204: Crypto Encryption - Solution', () => {
  const key = crypto.randomBytes(32);

  it('should encrypt and decrypt with AES-256-CBC', () => {
    const text = 'Hello, World!';
    const { encrypted, iv } = encryptAES256CBC(text, key);

    expect(typeof encrypted).toBe('string');
    expect(typeof iv).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);
    expect(iv.length).toBe(32);

    const decrypted = decryptAES256CBC(encrypted, iv, key);
    expect(decrypted).toBe(text);

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
    expect(authTag.length).toBe(32);

    const decrypted = decryptAES256GCM(encrypted, iv, authTag, key);
    expect(decrypted).toBe(text);
  });

  it('should detect tampering with GCM auth tag', () => {
    const text = 'Important data';
    const { encrypted, iv, authTag } = encryptAES256GCM(text, key);

    const wrongAuthTag = authTag.replace(/./g, '0');
    expect(() => {
      decryptAES256GCM(encrypted, iv, wrongAuthTag, key);
    }).toThrow();

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
    expect(encryptedData.key.length).toBe(64);

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
