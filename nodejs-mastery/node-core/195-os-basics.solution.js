import { describe, it, expect } from 'vitest';
import os from 'os';

/**
 * Exercise 195: OS Module - System Information Basics - SOLUTION
 */

export function getPlatform() {
  return os.platform();
}

export function getArchitecture() {
  return os.arch();
}

export function getCpuCoreCount() {
  return os.cpus().length;
}

export function getCpuModel() {
  return os.cpus()[0].model;
}

export function getTotalMemoryGB() {
  const totalBytes = os.totalmem();
  const totalGB = totalBytes / (1024 ** 3);
  return parseFloat(totalGB.toFixed(2));
}

export function getFreeMemoryGB() {
  const freeBytes = os.freemem();
  const freeGB = freeBytes / (1024 ** 3);
  return parseFloat(freeGB.toFixed(2));
}

export function getMemoryUsagePercent() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const percentage = (used / total) * 100;
  return parseFloat(percentage.toFixed(2));
}

export function getFormattedUptime() {
  const seconds = os.uptime();

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days} days, ${hours} hours, ${minutes} minutes`;
}

// Tests
describe('Exercise 195: OS Basics - Solution', () => {
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
