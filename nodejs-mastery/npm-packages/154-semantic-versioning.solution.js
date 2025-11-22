/**
 * SOLUTION 154: Semantic Versioning
 */

import { describe, it, expect } from 'vitest';

export const parseVersion = (version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

export const whenToBumpMajor = () => {
  return 'c'; // Breaking change (incompatible API change)
};

export const whenToBumpMinor = () => {
  return 'b'; // New feature (backward-compatible)
};

export const whenToBumpPatch = () => {
  return 'c'; // Bug fix (backward-compatible)
};

export const caretRange = () => {
  return 'c'; // 4.x.x (minor and patch updates)
};

export const tildeRange = () => {
  return 'b'; // 4.18.x (patch updates only)
};

export const wildcardVersion = () => {
  return 'c'; // Any version (not recommended)
};

export const getNextVersion = (currentVersion, changeType) => {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  if (changeType === 'major') {
    return `${major + 1}.0.0`;
  } else if (changeType === 'minor') {
    return `${major}.${minor + 1}.0`;
  } else if (changeType === 'patch') {
    return `${major}.${minor}.${patch + 1}`;
  }

  return currentVersion;
};

// ============================================
// TESTS
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
