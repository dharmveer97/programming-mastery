import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 203: Crypto Module - HMAC (Hash-based Message Authentication Code)
 *
 * HMAC provides message authentication using a hash function and a secret key.
 * Unlike regular hashes, HMACs require a secret key, making them suitable for:
 * - Verifying message integrity
 * - Authenticating API requests
 * - Creating secure tokens
 * - Signing cookies and sessions
 *
 * Key concepts:
 * - crypto.createHmac(algorithm, key) - creates an HMAC object
 * - hmac.update(data) - adds data to be authenticated
 * - hmac.digest(encoding) - returns the HMAC signature
 *
 * Common algorithms:
 * - sha256 - Most commonly used
 * - sha512 - More secure, longer output
 *
 * Security best practices:
 * - Keep the secret key confidential
 * - Use a strong, random secret key
 * - Use constant-time comparison to prevent timing attacks
 * - Rotate keys periodically
 *
 * Task: Implement HMAC-based message authentication
 */

// TODO: Create an HMAC signature for a message
// Use SHA256 algorithm and return hex-encoded signature
export function createHMACSignature(message, secretKey) {
  // Your code here
}

// TODO: Verify an HMAC signature
// Return true if the signature matches the message
// Use timing-safe comparison (crypto.timingSafeEqual)
export function verifyHMACSignature(message, signature, secretKey) {
  // Your code here
}

// TODO: Sign API request data
// Create an HMAC of JSON stringified data with timestamp
// Return object with { data, timestamp, signature }
// This is commonly used for API authentication
export function signAPIRequest(data, apiSecret) {
  // Your code here
}

// TODO: Verify API request signature
// Check if signature is valid and timestamp is recent (within 5 minutes)
// Return true if valid, false otherwise
export function verifyAPIRequest(requestData, apiSecret) {
  // Your code here
}

// TODO: Create a signed token
// Combine userId and expiresAt, create HMAC signature
// Return token as "userId:expiresAt:signature"
// Common pattern for session tokens
export function createSignedToken(userId, expiresAt, secret) {
  // Your code here
}

// TODO: Verify and parse signed token
// Split token, verify signature, check expiration
// Return { valid: true, userId } if valid
// Return { valid: false, error: 'reason' } if invalid
export function verifySignedToken(token, secret) {
  // Your code here
}

// TODO: Create HMAC with SHA512
// Use SHA512 algorithm and return base64-encoded signature
// SHA512 provides stronger security than SHA256
export function createHMACSHA512(message, secretKey) {
  // Your code here
}

// TODO: Generate secure cookie signature
// Create HMAC signature for cookie value
// Return "value.signature" format (common in frameworks like Express)
export function signCookie(cookieValue, cookieSecret) {
  // Your code here
}

// Tests
describe('Exercise 203: Crypto HMAC', () => {
  const secret = 'my-secret-key';

  it('should create HMAC signature', () => {
    const signature = createHMACSignature('hello world', secret);
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(64); // SHA256 hex = 64 chars

    // Same input should produce same signature
    const signature2 = createHMACSignature('hello world', secret);
    expect(signature).toBe(signature2);

    // Different secret should produce different signature
    const signature3 = createHMACSignature('hello world', 'different-secret');
    expect(signature).not.toBe(signature3);
  });

  it('should verify HMAC signature correctly', () => {
    const message = 'test message';
    const signature = createHMACSignature(message, secret);

    expect(verifyHMACSignature(message, signature, secret)).toBe(true);
    expect(verifyHMACSignature(message, signature, 'wrong-secret')).toBe(false);
    expect(verifyHMACSignature('wrong message', signature, secret)).toBe(false);
    expect(verifyHMACSignature(message, 'wrong-signature', secret)).toBe(false);
  });

  it('should sign API request', () => {
    const data = { user: 'john', action: 'update' };
    const signed = signAPIRequest(data, secret);

    expect(signed).toHaveProperty('data');
    expect(signed).toHaveProperty('timestamp');
    expect(signed).toHaveProperty('signature');
    expect(signed.data).toEqual(data);
    expect(typeof signed.timestamp).toBe('number');
    expect(typeof signed.signature).toBe('string');
  });

  it('should verify API request', () => {
    const data = { user: 'john', action: 'update' };
    const signed = signAPIRequest(data, secret);

    expect(verifyAPIRequest(signed, secret)).toBe(true);
    expect(verifyAPIRequest(signed, 'wrong-secret')).toBe(false);

    // Test with old timestamp (more than 5 minutes)
    const oldSigned = {
      ...signed,
      timestamp: Date.now() - 6 * 60 * 1000
    };
    expect(verifyAPIRequest(oldSigned, secret)).toBe(false);

    // Test with tampered data
    const tampered = {
      ...signed,
      data: { user: 'hacker', action: 'delete' }
    };
    expect(verifyAPIRequest(tampered, secret)).toBe(false);
  });

  it('should create signed token', () => {
    const userId = 'user123';
    const expiresAt = Date.now() + 3600000; // 1 hour
    const token = createSignedToken(userId, expiresAt, secret);

    expect(typeof token).toBe('string');
    const parts = token.split(':');
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe(userId);
    expect(parts[1]).toBe(expiresAt.toString());
  });

  it('should verify signed token', () => {
    const userId = 'user123';
    const expiresAt = Date.now() + 3600000; // 1 hour
    const token = createSignedToken(userId, expiresAt, secret);

    const result = verifySignedToken(token, secret);
    expect(result.valid).toBe(true);
    expect(result.userId).toBe(userId);

    // Test with wrong secret
    const wrongSecret = verifySignedToken(token, 'wrong-secret');
    expect(wrongSecret.valid).toBe(false);
    expect(wrongSecret.error).toBeDefined();

    // Test with expired token
    const expiredToken = createSignedToken(userId, Date.now() - 1000, secret);
    const expiredResult = verifySignedToken(expiredToken, secret);
    expect(expiredResult.valid).toBe(false);
    expect(expiredResult.error).toBe('Token expired');

    // Test with tampered token
    const tampered = token.replace('user123', 'hacker');
    const tamperedResult = verifySignedToken(tampered, secret);
    expect(tamperedResult.valid).toBe(false);
    expect(tamperedResult.error).toBe('Invalid signature');
  });

  it('should create HMAC with SHA512', () => {
    const signature = createHMACSHA512('hello', secret);
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(88); // SHA512 base64 = 88 chars

    // Different from SHA256
    const sha256sig = createHMACSignature('hello', secret);
    expect(signature).not.toBe(sha256sig);
  });

  it('should sign cookie', () => {
    const cookieValue = 'session-id-12345';
    const signed = signCookie(cookieValue, secret);

    expect(typeof signed).toBe('string');
    expect(signed).toContain('.');
    const [value, signature] = signed.split('.');
    expect(value).toBe(cookieValue);
    expect(signature).toBeDefined();
    expect(signature.length).toBeGreaterThan(0);
  });
});
