/**
 * EXERCISE 154: Semantic Versioning (SemVer)
 *
 * Learn how version numbers work in npm packages.
 *
 * SEMVER FORMAT: MAJOR.MINOR.PATCH
 * - MAJOR: Breaking changes (incompatible API changes)
 * - MINOR: New features (backward-compatible)
 * - PATCH: Bug fixes (backward-compatible)
 *
 * EXAMPLES:
 * - 1.0.0 → 2.0.0 (breaking change)
 * - 1.0.0 → 1.1.0 (new feature)
 * - 1.0.0 → 1.0.1 (bug fix)
 *
 * YOUR TASK:
 * Understand and apply semantic versioning rules.
 */

import { describe, it, expect } from 'vitest';

/**
 * Q1: Parse a version string
 * Extract major, minor, and patch numbers.
 */
export const parseVersion = (version) => {
  // TODO: Parse "4.18.2" into { major: 4, minor: 18, patch: 2 }
  return {
    major: 0,
    minor: 0,
    patch: 0
  };
};

/**
 * Q2: When should you bump the MAJOR version?
 */
export const whenToB umpMajor = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Bug fix
  // b) New feature
  // c) Breaking change (incompatible API change)
  // d) Documentation update

  return '';
};

/**
 * Q3: When should you bump the MINOR version?
 */
export const whenToBumpMinor = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Bug fix
  // b) New feature (backward-compatible)
  // c) Breaking change
  // d) Performance improvement

  return '';
};

/**
 * Q4: When should you bump the PATCH version?
 */
export const whenToBumpPatch = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Breaking change
  // b) New feature
  // c) Bug fix (backward-compatible)
  // d) Major refactor

  return '';
};

/**
 * Q5: What versions does "^4.18.2" allow?
 */
export const caretRange = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Only 4.18.2
  // b) 4.18.x (patch updates only)
  // c) 4.x.x (minor and patch updates)
  // d) Any version

  return '';
};

/**
 * Q6: What versions does "~4.18.2" allow?
 */
export const tildeRange = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Only 4.18.2
  // b) 4.18.x (patch updates only)
  // c) 4.x.x (minor and patch updates)
  // d) Any version

  return '';
};

/**
 * Q7: What does "*" mean in version?
 */
export const wildcardVersion = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Only stable versions
  // b) Latest version
  // c) Any version (not recommended)
  // d) No version

  return '';
};

/**
 * Q8: Determine next version
 * Given current version and change type, return next version.
 */
export const getNextVersion = (currentVersion, changeType) => {
  // TODO: Implement version bumping
  // currentVersion: "2.5.3"
  // changeType: "major" | "minor" | "patch"
  //
  // Examples:
  // - "2.5.3", "major" → "3.0.0"
  // - "2.5.3", "minor" → "2.6.0"
  // - "2.5.3", "patch" → "2.5.4"

  return '';
};

// ============================================
// TESTS - Don't modify below
// ============================================

describe('Semantic Versioning', () => {
  it('should parse version string', () => {
    expect(parseVersion('4.18.2')).toEqual({ major: 4, minor: 18, patch: 2 });
    expect(parseVersion('1.0.0')).toEqual({ major: 1, minor: 0, patch: 0 });
    expect(parseVersion('10.25.99')).toEqual({ major: 10, minor: 25, patch: 99 });
  });

  it('should know when to bump major', () => {
    expect(whenToBumpMajor()).toBe('c');
  });

  it('should know when to bump minor', () => {
    expect(whenToBumpMinor()).toBe('b');
  });

  it('should know when to bump patch', () => {
    expect(whenToBumpPatch()).toBe('c');
  });

  it('should understand caret range', () => {
    expect(caretRange()).toBe('c');
  });

  it('should understand tilde range', () => {
    expect(tildeRange()).toBe('b');
  });

  it('should understand wildcard', () => {
    expect(wildcardVersion()).toBe('c');
  });

  it('should calculate next version', () => {
    expect(getNextVersion('2.5.3', 'major')).toBe('3.0.0');
    expect(getNextVersion('2.5.3', 'minor')).toBe('2.6.0');
    expect(getNextVersion('2.5.3', 'patch')).toBe('2.5.4');
    expect(getNextVersion('1.0.0', 'major')).toBe('2.0.0');
  });
});
