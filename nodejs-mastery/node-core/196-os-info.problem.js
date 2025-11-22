import { describe, it, expect } from 'vitest';
import os from 'os';

/**
 * Exercise 196: OS Module - User and System Information
 *
 * The os module also provides user-specific and system path information.
 *
 * Key methods for user/system info:
 * - os.hostname() - returns the hostname of the OS
 * - os.userInfo() - returns info about current user (username, homedir, shell, etc.)
 * - os.homedir() - returns home directory of current user
 * - os.tmpdir() - returns OS temp directory path
 * - os.EOL - constant for end-of-line marker ('\n' on Unix, '\r\n' on Windows)
 *
 * Task: Work with OS user and system information methods
 */

// TODO: Get the system hostname
// Should return the hostname as a string
export function getHostname() {
  // Your code here
}

// TODO: Get current user's username
// Use os.userInfo() to get user information
export function getUsername() {
  // Your code here
}

// TODO: Get current user's home directory
// Use os.homedir()
export function getUserHomeDir() {
  // Your code here
}

// TODO: Get current user's shell (Unix/Linux/Mac only)
// Use os.userInfo() and return the shell property
// On Windows, this might be undefined
export function getUserShell() {
  // Your code here
}

// TODO: Get the temp directory path
// Use os.tmpdir()
export function getTempDir() {
  // Your code here
}

// TODO: Get the platform-specific end-of-line marker
// Use os.EOL constant
// Returns '\n' on Unix-like systems, '\r\n' on Windows
export function getEOL() {
  // Your code here
}

// TODO: Create a multi-line string using os.EOL
// Join the array elements with os.EOL
// Example: ['Line 1', 'Line 2'] -> 'Line 1\nLine 2' (or '\r\n' on Windows)
export function joinWithEOL(lines) {
  // Your code here
}

// TODO: Create a system info object
// Return an object with hostname, username, homedir, tmpdir, and platform
export function getSystemInfo() {
  // Your code here
  // Return format:
  // {
  //   hostname: '...',
  //   username: '...',
  //   homedir: '...',
  //   tmpdir: '...',
  //   platform: '...'
  // }
}

// Tests
describe('Exercise 196: OS User and System Info', () => {
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
    // Should be an absolute path
    expect(homedir.startsWith('/')).toBeTruthy();
  });

  it('should get user shell', () => {
    const shell = getUserShell();
    // Shell might be undefined on Windows
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
    // Should be either Unix or Windows line ending
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
