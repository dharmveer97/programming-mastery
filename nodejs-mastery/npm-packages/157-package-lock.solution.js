/**
 * SOLUTION 157: package-lock.json
 */

import { describe, it, expect } from 'vitest';

export const packageLockPurpose = () => {
  return 'b'; // Ensure consistent dependency versions across all environments
};

export const shouldCommitLock = () => {
  return 'b'; // Yes, always commit it (for applications)
};

export const packageJsonVsLock = () => {
  return {
    packageJson: 'Contains version ranges and metadata about your project',
    packageLock: 'Contains exact versions of all dependencies and their dependencies'
  };
};

export const whenLockUpdates = () => {
  return [
    'When you run npm install',
    'When you add a new package (npm install <package>)',
    'When you remove a package (npm uninstall <package>)',
    'When you update a package (npm update <package>)'
  ];
};

export const deterministicInstall = () => {
  return 'b'; // Installing the same exact versions every time
};

export const resolveLockConflict = () => {
  return 'c'; // Resolve manually, then run npm install to regenerate
};

export const lockFileContents = () => {
  return [
    'Exact version numbers for all dependencies',
    'Integrity hashes (checksums) for security',
    'Resolved URLs where packages are downloaded from',
    'Complete dependency tree (including nested dependencies)'
  ];
};

export const versionLocking = () => {
  return 'b'; // Installs exactly 4.18.2 (from lock file)
};

// ============================================
// TESTS
// ============================================

describe('package-lock.json', () => {
  it('should understand package-lock.json purpose', () => {
    expect(packageLockPurpose()).toBe('b');
  });

  it('should know to commit package-lock.json', () => {
    expect(shouldCommitLock()).toBe('b');
  });

  it('should understand difference between package.json and lock', () => {
    const diff = packageJsonVsLock();
    expect(diff.packageJson.toLowerCase()).toMatch(/range|version|dependencies/);
    expect(diff.packageLock.toLowerCase()).toMatch(/exact|specific|locked/);
  });

  it('should know when lock file updates', () => {
    const scenarios = whenLockUpdates();
    expect(scenarios.length).toBeGreaterThanOrEqual(3);
    expect(scenarios.some(s => s.toLowerCase().includes('install'))).toBe(true);
  });

  it('should understand deterministic installs', () => {
    expect(deterministicInstall()).toBe('b');
  });

  it('should know how to resolve lock conflicts', () => {
    expect(resolveLockConflict()).toBe('c');
  });

  it('should know what lock file contains', () => {
    const contents = lockFileContents();
    expect(contents.length).toBeGreaterThanOrEqual(3);
    expect(contents.some(c => c.toLowerCase().includes('version'))).toBe(true);
  });

  it('should understand version locking behavior', () => {
    expect(versionLocking()).toBe('b');
  });
});
