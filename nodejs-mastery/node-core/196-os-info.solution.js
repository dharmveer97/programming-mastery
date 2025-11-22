import { describe, it, expect } from 'vitest';
import os from 'os';

/**
 * Exercise 196: OS Module - User and System Information - SOLUTION
 */

export function getHostname() {
  return os.hostname();
}

export function getUsername() {
  return os.userInfo().username;
}

export function getUserHomeDir() {
  return os.homedir();
}

export function getUserShell() {
  return os.userInfo().shell;
}

export function getTempDir() {
  return os.tmpdir();
}

export function getEOL() {
  return os.EOL;
}

export function joinWithEOL(lines) {
  return lines.join(os.EOL);
}

export function getSystemInfo() {
  return {
    hostname: os.hostname(),
    username: os.userInfo().username,
    homedir: os.homedir(),
    tmpdir: os.tmpdir(),
    platform: os.platform()
  };
}

// Tests
describe('Exercise 196: OS User and System Info - Solution', () => {
  it('should get hostname', () => {
    const hostname = getHostname();
    expect(typeof hostname).toBe('string');
    expect(hostname.length).toBeGreaterThan(0);
  });

  it('should get username', () => {
    const username = getUsername();
    expect(typeof username).toBe('string');
    expect(username.length).toBeGreaterThan(0);
  });

  it('should get user home directory', () => {
    const homedir = getUserHomeDir();
    expect(typeof homedir).toBe('string');
    expect(homedir.length).toBeGreaterThan(0);
    expect(homedir.startsWith('/')).toBeTruthy();
  });

  it('should get user shell', () => {
    const shell = getUserShell();
    if (shell !== undefined) {
      expect(typeof shell).toBe('string');
    }
  });

  it('should get temp directory', () => {
    const tmpdir = getTempDir();
    expect(typeof tmpdir).toBe('string');
    expect(tmpdir.length).toBeGreaterThan(0);
  });

  it('should get EOL marker', () => {
    const eol = getEOL();
    expect(typeof eol).toBe('string');
    expect(['\n', '\r\n']).toContain(eol);
  });

  it('should join lines with platform-specific EOL', () => {
    const lines = ['First line', 'Second line', 'Third line'];
    const result = joinWithEOL(lines);

    const expectedEOL = os.EOL;
    const expected = lines.join(expectedEOL);

    expect(result).toBe(expected);
    expect(result.includes('First line')).toBe(true);
    expect(result.includes('Second line')).toBe(true);
    expect(result.includes('Third line')).toBe(true);
  });

  it('should get complete system info', () => {
    const info = getSystemInfo();

    expect(typeof info).toBe('object');
    expect(typeof info.hostname).toBe('string');
    expect(typeof info.username).toBe('string');
    expect(typeof info.homedir).toBe('string');
    expect(typeof info.tmpdir).toBe('string');
    expect(typeof info.platform).toBe('string');

    expect(info.hostname.length).toBeGreaterThan(0);
    expect(info.username.length).toBeGreaterThan(0);
    expect(info.homedir.length).toBeGreaterThan(0);
    expect(info.tmpdir.length).toBeGreaterThan(0);
    expect(['darwin', 'linux', 'win32', 'freebsd', 'openbsd', 'aix', 'sunos']).toContain(info.platform);
  });
});
