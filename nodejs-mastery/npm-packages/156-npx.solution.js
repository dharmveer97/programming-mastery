/**
 * SOLUTION 156: npx - Package Runner
 */

import { describe, it, expect } from 'vitest';

export const npxPurpose = () => {
  return 'c'; // Execute packages without installing them globally
};

export const runWithNpx = () => {
  return 'npx create-react-app my-app';
};

export const npmVsNpx = () => {
  return {
    npm: 'Installs and manages packages in your project',
    npx: 'Executes packages without installing them globally'
  };
};

export const whenToUseNpx = () => {
  return [
    'One-time use commands (project generators)',
    'Testing different versions of a tool',
    'Running scripts without polluting global namespace',
    'Always using the latest version of a tool'
  ];
};

export const runSpecificVersion = () => {
  return 'npx create-react-app@4.0.0 my-app';
};

export const npxLocalBehavior = () => {
  return 'b'; // Uses the local version first
};

export const npxUseCases = () => {
  return [
    'Project generators (create-react-app, create-next-app)',
    'One-time setup scripts (eslint --init, tsc --init)',
    'Running build tools (webpack, vite)',
    'Testing tools without installing',
    'Running GitHub gists or repos directly'
  ];
};

export const convertToNpx = () => {
  return {
    createReactApp: 'npx create-react-app my-app',
    eslintInit: 'npx eslint --init',
    typescriptInit: 'npx tsc --init'
  };
};

// ============================================
// TESTS
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
