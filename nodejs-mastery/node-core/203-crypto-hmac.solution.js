import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

/**
 * Exercise 203: Crypto Module - HMAC - SOLUTION
 */

export function createHMACSignature(message, secretKey) {
  return crypto.createHmac('sha256', secretKey).update(message).digest('hex');
}

export function verifyHMACSignature(message, signature, secretKey) {
  const expectedSignature = createHMACSignature(message, secretKey);

  // Use timing-safe comparison to prevent timing attacks
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export function signAPIRequest(data, apiSecret) {
  const timestamp = Date.now();
  const payload = JSON.stringify({ data, timestamp });
  const signature = createHMACSignature(payload, apiSecret);

  return { data, timestamp, signature };
}

export function verifyAPIRequest(requestData, apiSecret) {
  const { data, timestamp, signature } = requestData;

  // Check if timestamp is within 5 minutes
  const fiveMinutes = 5 * 60 * 1000;
  if (Date.now() - timestamp > fiveMinutes) {
    return false;
  }

  // Verify signature
  const payload = JSON.stringify({ data, timestamp });
  return verifyHMACSignature(payload, signature, apiSecret);
}

export function createSignedToken(userId, expiresAt, secret) {
  const payload = `${userId}:${expiresAt}`;
  const signature = createHMACSignature(payload, secret);
  return `${payload}:${signature}`;
}

export function verifySignedToken(token, secret) {
  const parts = token.split(':');

  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid token format' };
  }

  const [userId, expiresAt, signature] = parts;
  const payload = `${userId}:${expiresAt}`;

  // Verify signature
  if (!verifyHMACSignature(payload, signature, secret)) {
    return { valid: false, error: 'Invalid signature' };
  }

  // Check expiration
  if (Date.now() > parseInt(expiresAt)) {
    return { valid: false, error: 'Token expired' };
  }

  return { valid: true, userId };
}

export function createHMACSHA512(message, secretKey) {
  return crypto.createHmac('sha512', secretKey).update(message).digest('base64');
}

export function signCookie(cookieValue, cookieSecret) {
  const signature = createHMACSignature(cookieValue, cookieSecret);
  return `${cookieValue}.${signature}`;
}

// Tests
describe('Exercise 203: Crypto HMAC - Solution', () => {
  const secret = 'my-secret-key';

  it('should create HMAC signature', () => {
    const signature = createHMACSignature('hello world', secret);
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(64);

    const signature2 = createHMACSignature('hello world', secret);
    expect(signature).toBe(signature2);

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

    const oldSigned = {
      ...signed,
      timestamp: Date.now() - 6 * 60 * 1000
    };
    expect(verifyAPIRequest(oldSigned, secret)).toBe(false);

    const tampered = {
      ...signed,
      data: { user: 'hacker', action: 'delete' }
    };
    expect(verifyAPIRequest(tampered, secret)).toBe(false);
  });

  it('should create signed token', () => {
    const userId = 'user123';
    const expiresAt = Date.now() + 3600000;
    const token = createSignedToken(userId, expiresAt, secret);

    expect(typeof token).toBe('string');
    const parts = token.split(':');
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe(userId);
    expect(parts[1]).toBe(expiresAt.toString());
  });

  it('should verify signed token', () => {
    const userId = 'user123';
    const expiresAt = Date.now() + 3600000;
    const token = createSignedToken(userId, expiresAt, secret);

    const result = verifySignedToken(token, secret);
    expect(result.valid).toBe(true);
    expect(result.userId).toBe(userId);

    const wrongSecret = verifySignedToken(token, 'wrong-secret');
    expect(wrongSecret.valid).toBe(false);
    expect(wrongSecret.error).toBeDefined();

    const expiredToken = createSignedToken(userId, Date.now() - 1000, secret);
    const expiredResult = verifySignedToken(expiredToken, secret);
    expect(expiredResult.valid).toBe(false);
    expect(expiredResult.error).toBe('Token expired');

    const tampered = token.replace('user123', 'hacker');
    const tamperedResult = verifySignedToken(tampered, secret);
    expect(tamperedResult.valid).toBe(false);
    expect(tamperedResult.error).toBe('Invalid signature');
  });

  it('should create HMAC with SHA512', () => {
    const signature = createHMACSHA512('hello', secret);
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(88);

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
