import { describe, it, expect } from 'vitest';
import dns from 'dns';
import { promisify } from 'util';

/**
 * Exercise 206: DNS Module - Domain Name Resolution
 *
 * The dns module provides functions for performing DNS lookups and name resolution.
 * It can resolve domain names to IP addresses and vice versa.
 *
 * Key methods:
 * - dns.lookup() - uses OS facilities, returns first address found
 * - dns.resolve4() - queries DNS server directly for IPv4 addresses
 * - dns.resolve6() - queries DNS server directly for IPv6 addresses
 * - dns.resolveMx() - gets mail exchange records
 * - dns.reverse() - performs reverse DNS lookup (IP to hostname)
 * - promisify() from util - converts callback-based functions to promises
 *
 * Task: Work with DNS resolution and lookups
 */

const lookup = promisify(dns.lookup);
const resolve4 = promisify(dns.resolve4);
const resolveMx = promisify(dns.resolveMx);
const reverse = promisify(dns.reverse);

// TODO: Perform a basic DNS lookup
// Use dns.lookup (promisified) to get the IP address for a hostname
// Return the address property from the result
export async function lookupHostname(hostname) {
  // Your code here
}

// TODO: Get all IPv4 addresses for a hostname
// Use dns.resolve4 to get all IPv4 addresses
// Return the array of addresses
export async function getAllIPv4Addresses(hostname) {
  // Your code here
}

// TODO: Get mail server information
// Use dns.resolveMx to get MX (mail exchange) records
// Return the array of MX records sorted by priority (lowest first)
export async function getMailServers(domain) {
  // Your code here
}

// TODO: Get the hostname with the lowest priority mail server
// Use dns.resolveMx and return the 'exchange' property of the MX record with lowest priority
export async function getPrimaryMailServer(domain) {
  // Your code here
}

// TODO: Perform reverse DNS lookup
// Use dns.reverse to get hostnames from an IP address
// Return the first hostname from the array
export async function reverseIP(ipAddress) {
  // Your code here
}

// TODO: Check if a hostname resolves
// Try to lookup the hostname, return true if successful, false if it fails
// Catch any errors and return false
export async function canResolve(hostname) {
  // Your code here
}

// TODO: Get DNS lookup family (IPv4 or IPv6)
// Use dns.lookup to get address info
// Return 4 if IPv4, 6 if IPv6 based on the family property
export async function getAddressFamily(hostname) {
  // Your code here
}

// TODO: Compare lookup vs resolve4
// Return an object with:
// - lookup: result from dns.lookup (just the address)
// - resolve4: result from dns.resolve4 (array of addresses)
export async function compareLookupMethods(hostname) {
  // Your code here
}

// Tests
describe('Exercise 206: DNS Lookup', () => {
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
    // Verify sorting by priority
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
    // Google's public DNS
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
