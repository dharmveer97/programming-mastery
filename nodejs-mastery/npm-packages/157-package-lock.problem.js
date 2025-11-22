/**
 * EXERCISE 157: package-lock.json
 *
 * Learn about package-lock.json and deterministic installs.
 *
 * TOPICS:
 * - Purpose of package-lock.json
 * - Deterministic installations
 * - Lock file vs package.json
 * - When to commit lock files
 * - Resolving lock file conflicts
 *
 * WHAT IS PACKAGE-LOCK.JSON?
 * - Automatically generated file
 * - Records exact versions of all dependencies (including nested)
 * - Ensures consistent installs across environments
 * - Should be committed to version control
 *
 * YOUR TASK:
 * Understand the importance and usage of package-lock.json.
 */

import { describe, it, expect } from 'vitest';

/**
 * Q1: What is the main purpose of package-lock.json?
 */
export const packageLockPurpose = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Make npm install faster
  // b) Ensure consistent dependency versions across all environments
  // c) Reduce package size
  // d) List all available packages

  return '';
};

/**
 * Q2: Should you commit package-lock.json to version control?
 */
export const shouldCommitLock = () => {
  // TODO: Choose correct answer (return the letter)
  // a) No, never commit it
  // b) Yes, always commit it (for applications)
  // c) Only for production
  // d) Only for development

  return '';
};

/**
 * Q3: What's the difference between package.json and package-lock.json?
 */
export const packageJsonVsLock = () => {
  // TODO: Return an object explaining the differences
  return {
    packageJson: '', // What package.json contains
    packageLock: ''  // What package-lock.json contains
  };
};

/**
 * Q4: When is package-lock.json created/updated?
 */
export const whenLockUpdates = () => {
  // TODO: Return an array of scenarios when package-lock.json updates
  // Consider: npm install, adding packages, removing packages, etc.

  return [];
};

/**
 * Q5: What does "deterministic install" mean?
 */
export const deterministicInstall = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Installing packages in alphabetical order
  // b) Installing the same exact versions every time
  // c) Installing only production dependencies
  // d) Installing from cache

  return '';
};

/**
 * Q6: What should you do if you get a package-lock.json merge conflict?
 */
export const resolveLockConflict = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Delete package-lock.json and reinstall
  // b) Keep both versions
  // c) Resolve manually, then run npm install to regenerate
  // d) Always keep your version

  return '';
};

/**
 * Q7: What information does package-lock.json store?
 */
export const lockFileContents = () => {
  // TODO: Return an array of what's stored in package-lock.json
  // Consider: exact versions, integrity hashes, resolved URLs, etc.

  return [];
};

/**
 * Q8: Package.json vs Package-lock.json versions
 * Given package.json dependencies, what does package-lock.json ensure?
 */
export const versionLocking = () => {
  // Scenario:
  // package.json has: "express": "^4.18.0"
  // package-lock.json has: "express": "4.18.2"
  //
  // When someone runs npm install:

  // TODO: Choose correct answer (return the letter)
  // a) Installs latest 4.x.x version
  // b) Installs exactly 4.18.2 (from lock file)
  // c) Installs 4.18.0 (from package.json)
  // d) Asks which version to install

  return '';
};

// ============================================
// TESTS - Don't modify below
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
