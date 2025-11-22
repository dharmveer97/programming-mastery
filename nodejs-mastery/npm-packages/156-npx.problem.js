/**
 * EXERCISE 156: npx - Package Runner
 *
 * Learn how to use npx to execute packages without installing them.
 *
 * TOPICS:
 * - npx vs npm
 * - Running packages without installing
 * - Executing one-time commands
 * - Running different package versions
 * - npx with local vs remote packages
 *
 * WHAT IS NPX?
 * - Package runner that comes with npm (5.2+)
 * - Executes packages without installing them globally
 * - Always uses the latest version (or specified version)
 * - Useful for one-time commands and testing
 *
 * YOUR TASK:
 * Understand when and how to use npx effectively.
 */

import { describe, it, expect } from 'vitest';

/**
 * Q1: What is the main purpose of npx?
 */
export const npxPurpose = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Install packages permanently
  // b) Update all packages
  // c) Execute packages without installing them globally
  // d) Remove unused packages

  return '';
};

/**
 * Q2: How do you run a package using npx?
 * Return the correct command to run 'create-react-app' with npx.
 */
export const runWithNpx = () => {
  // TODO: Return the npx command to run 'create-react-app my-app'
  // Format: "npx <package> <args>"

  return '';
};

/**
 * Q3: What's the difference between npm and npx?
 */
export const npmVsNpx = () => {
  // TODO: Return an object describing the differences
  return {
    npm: '', // What npm does (install/manage packages)
    npx: ''  // What npx does (execute packages)
  };
};

/**
 * Q4: When should you use npx instead of npm install -g?
 */
export const whenToUseNpx = () => {
  // TODO: Return an array of scenarios where npx is better
  // Consider: one-time use, testing, always latest version, etc.

  return [];
};

/**
 * Q5: How do you run a specific version of a package with npx?
 * Return the command to run create-react-app version 4.0.0.
 */
export const runSpecificVersion = () => {
  // TODO: Return the npx command to run a specific version
  // Format: "npx package@version"

  return '';
};

/**
 * Q6: What happens if you run npx with a package that's already installed locally?
 */
export const npxLocalBehavior = () => {
  // TODO: Choose correct answer (return the letter)
  // a) Always downloads from npm
  // b) Uses the local version first
  // c) Throws an error
  // d) Asks for confirmation

  return '';
};

/**
 * Q7: List common use cases for npx
 */
export const npxUseCases = () => {
  // TODO: Return an array of common npx use cases
  // Examples: project generators, one-time scripts, testing tools, etc.

  return [];
};

/**
 * Q8: npx command equivalents
 * Convert these npm workflows to npx commands.
 */
export const convertToNpx = () => {
  // TODO: Convert these npm workflows to npx commands

  return {
    // Instead of: npm install -g create-react-app && create-react-app my-app
    createReactApp: '',

    // Instead of: npm install -g eslint && eslint --init
    eslintInit: '',

    // Instead of: npm install -g typescript && tsc --init
    typescriptInit: ''
  };
};

// ============================================
// TESTS - Don't modify below
// ============================================

describe('npx - Package Runner', () => {
  it('should understand npx purpose', () => {
    expect(npxPurpose()).toBe('c');
  });

  it('should know how to run packages with npx', () => {
    const cmd = runWithNpx();
    expect(cmd).toMatch(/npx create-react-app my-app/);
  });

  it('should understand npm vs npx', () => {
    const diff = npmVsNpx();
    expect(diff.npm.toLowerCase()).toContain('install');
    expect(diff.npx.toLowerCase()).toContain('execute');
  });

  it('should know when to use npx', () => {
    const scenarios = whenToUseNpx();
    expect(scenarios.length).toBeGreaterThanOrEqual(3);
    expect(scenarios.some(s => s.toLowerCase().includes('one-time') || s.toLowerCase().includes('once'))).toBe(true);
  });

  it('should run specific version with npx', () => {
    const cmd = runSpecificVersion();
    expect(cmd).toMatch(/npx create-react-app@4\.0\.0/);
  });

  it('should understand local package behavior', () => {
    expect(npxLocalBehavior()).toBe('b');
  });

  it('should list common npx use cases', () => {
    const cases = npxUseCases();
    expect(cases.length).toBeGreaterThanOrEqual(3);
  });

  it('should convert npm workflows to npx', () => {
    const commands = convertToNpx();
    expect(commands.createReactApp).toMatch(/npx create-react-app/);
    expect(commands.eslintInit).toMatch(/npx eslint --init/);
    expect(commands.typescriptInit).toMatch(/npx (tsc|typescript) --init/);
  });
});
