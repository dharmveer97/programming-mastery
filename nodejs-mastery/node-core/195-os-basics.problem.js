import { describe, it, expect } from 'vitest';
import os from 'os';

/**
 * Exercise 195: OS Module - System Information Basics
 *
 * The os module provides operating system-related utility methods.
 * It helps you gather information about the system your Node.js app runs on.
 *
 * Key methods for system info:
 * - os.platform() - returns OS platform ('darwin', 'linux', 'win32', etc.)
 * - os.arch() - returns CPU architecture ('x64', 'arm', 'arm64', etc.)
 * - os.cpus() - returns array of CPU core information
 * - os.totalmem() - returns total system memory in bytes
 * - os.freemem() - returns free system memory in bytes
 * - os.uptime() - returns system uptime in seconds
 *
 * Task: Work with OS system information methods
 */

// TODO: Get the current platform
// Should return 'darwin', 'linux', 'win32', etc.
export function getPlatform() {
  // Your code here
}

// TODO: Get the CPU architecture
// Should return 'x64', 'arm', 'arm64', etc.
export function getArchitecture() {
  // Your code here
}

// TODO: Get the number of CPU cores
// Use os.cpus() which returns an array of CPU information
export function getCpuCoreCount() {
  // Your code here
}

// TODO: Get CPU model name
// Use os.cpus() and return the model name of the first CPU
export function getCpuModel() {
  // Your code here
}

// TODO: Convert bytes to GB and return total memory
// Return total system memory in GB (rounded to 2 decimal places)
export function getTotalMemoryGB() {
  // Your code here
}

// TODO: Convert bytes to GB and return free memory
// Return free system memory in GB (rounded to 2 decimal places)
export function getFreeMemoryGB() {
  // Your code here
}

// TODO: Calculate memory usage percentage
// Return percentage of memory being used (rounded to 2 decimal places)
// Formula: ((total - free) / total) * 100
export function getMemoryUsagePercent() {
  // Your code here
}

// TODO: Format uptime to human-readable string
// Convert seconds to "X days, Y hours, Z minutes"
// Example: 90061 seconds -> "1 days, 1 hours, 1 minutes"
export function getFormattedUptime() {
  // Your code here
}

// Tests
describe('Exercise 195: OS Basics', () => {
  it('should get platform', () => {
    const platform = getPlatform();
    expect(typeof platform).toBe('string');
    expect(['darwin', 'linux', 'win32', 'freebsd', 'openbsd', 'aix', 'sunos']).toContain(platform);
  });

  it('should get architecture', () => {
    const arch = getArchitecture();
    expect(typeof arch).toBe('string');
    expect(['x64', 'arm', 'arm64', 'ia32', 's390x', 'ppc64']).toContain(arch);
  });

  it('should get CPU core count', () => {
    const count = getCpuCoreCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThan(0);
  });

  it('should get CPU model', () => {
    const model = getCpuModel();
    expect(typeof model).toBe('string');
    expect(model.length).toBeGreaterThan(0);
  });

  it('should get total memory in GB', () => {
    const totalGB = getTotalMemoryGB();
    expect(typeof totalGB).toBe('number');
    expect(totalGB).toBeGreaterThan(0);
    // Check it's rounded to 2 decimal places
    expect(totalGB).toBe(parseFloat(totalGB.toFixed(2)));
  });

  it('should get free memory in GB', () => {
    const freeGB = getFreeMemoryGB();
    expect(typeof freeGB).toBe('number');
    expect(freeGB).toBeGreaterThan(0);
    expect(freeGB).toBe(parseFloat(freeGB.toFixed(2)));
  });

  it('should calculate memory usage percentage', () => {
    const usagePercent = getMemoryUsagePercent();
    expect(typeof usagePercent).toBe('number');
    expect(usagePercent).toBeGreaterThan(0);
    expect(usagePercent).toBeLessThan(100);
    expect(usagePercent).toBe(parseFloat(usagePercent.toFixed(2)));
  });

  it('should format uptime', () => {
    const uptime = getFormattedUptime();
    expect(typeof uptime).toBe('string');
    expect(uptime).toMatch(/\d+ days?, \d+ hours?, \d+ minutes?/);
  });
});
