import { describe, it, expect } from 'vitest';
import dns from 'dns';
import { promisify } from 'util';

/**
 * Exercise 206: DNS Module - Domain Name Resolution - SOLUTION
 */

const lookup = promisify(dns.lookup);
const resolve4 = promisify(dns.resolve4);
const resolveMx = promisify(dns.resolveMx);
const reverse = promisify(dns.reverse);

export async function lookupHostname(hostname) {
  const result = await lookup(hostname);
  return result.address;
}

export async function getAllIPv4Addresses(hostname) {
  return await resolve4(hostname);
}

export async function getMailServers(domain) {
  const mxRecords = await resolveMx(domain);
  return mxRecords.sort((a, b) => a.priority - b.priority);
}

export async function getPrimaryMailServer(domain) {
  const mxRecords = await resolveMx(domain);
  const sorted = mxRecords.sort((a, b) => a.priority - b.priority);
  return sorted[0].exchange;
}

export async function reverseIP(ipAddress) {
  const hostnames = await reverse(ipAddress);
  return hostnames[0];
}

export async function canResolve(hostname) {
  try {
    await lookup(hostname);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getAddressFamily(hostname) {
  const result = await lookup(hostname);
  return result.family;
}

export async function compareLookupMethods(hostname) {
  const lookupResult = await lookup(hostname);
  const resolve4Result = await resolve4(hostname);

  return {
    lookup: lookupResult.address,
    resolve4: resolve4Result
  };
}

// Tests
describe('Exercise 206: DNS Lookup - Solution', () => {
  it('should lookup hostname', async () => {
    const ip = await lookupHostname('google.com');
    expect(typeof ip).toBe('string');
    expect(ip).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });

  it('should get all IPv4 addresses', async () => {
    const addresses = await getAllIPv4Addresses('google.com');
    expect(Array.isArray(addresses)).toBe(true);
    expect(addresses.length).toBeGreaterThan(0);
    addresses.forEach(addr => {
      expect(addr).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    });
  });

  it('should get mail servers', async () => {
    const mxRecords = await getMailServers('google.com');
    expect(Array.isArray(mxRecords)).toBe(true);
    expect(mxRecords.length).toBeGreaterThan(0);
    expect(mxRecords[0]).toHaveProperty('exchange');
    expect(mxRecords[0]).toHaveProperty('priority');
    for (let i = 0; i < mxRecords.length - 1; i++) {
      expect(mxRecords[i].priority).toBeLessThanOrEqual(mxRecords[i + 1].priority);
    }
  });

  it('should get primary mail server', async () => {
    const primary = await getPrimaryMailServer('google.com');
    expect(typeof primary).toBe('string');
    expect(primary.length).toBeGreaterThan(0);
  });

  it('should perform reverse DNS lookup', async () => {
    const hostname = await reverseIP('8.8.8.8');
    expect(typeof hostname).toBe('string');
    expect(hostname).toContain('google');
  });

  it('should check if hostname resolves', async () => {
    const validResult = await canResolve('google.com');
    expect(validResult).toBe(true);

    const invalidResult = await canResolve('this-domain-definitely-does-not-exist-12345.com');
    expect(invalidResult).toBe(false);
  });

  it('should get address family', async () => {
    const family = await getAddressFamily('google.com');
    expect([4, 6]).toContain(family);
  });

  it('should compare lookup methods', async () => {
    const result = await compareLookupMethods('google.com');
    expect(result).toHaveProperty('lookup');
    expect(result).toHaveProperty('resolve4');
    expect(typeof result.lookup).toBe('string');
    expect(Array.isArray(result.resolve4)).toBe(true);
    expect(result.lookup).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });
});
