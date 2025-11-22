/**
 * SOLUTION 155: npm Scripts
 */

import { describe, it, expect } from 'vitest';

export const createNpmScripts = () => {
  return {
    start: 'node index.js',
    dev: 'nodemon index.js',
    test: 'vitest',
    build: 'tsc',
    lint: 'eslint .'
  };
};

export const runCustomScript = () => {
  return 'npm run dev';
};

export const createScriptsWithHooks = () => {
  return {
    prebuild: 'rm -rf dist',
    build: 'tsc',
    postbuild: 'cp package.json dist/'
  };
};

export const passArgumentsToScript = () => {
  return 'npm run test -- --coverage';
};

export const useEnvironmentVariables = () => {
  return {
    start: 'NODE_ENV=production node index.js',
    dev: 'NODE_ENV=development nodemon index.js'
  };
};

export const chainCommands = () => {
  return {
    check: 'eslint . && vitest run && tsc'
  };
};

export const specialStartScript = () => {
  return 'b'; // You can run it with "npm start" (no "run" needed)
};

export const specialTestScript = () => {
  return 'b'; // You can run it with "npm test" (no "run" needed)
};

// ============================================
// TESTS
// ============================================

describe('npm Scripts', () => {
  it('should create npm scripts', () => {
    const scripts = createNpmScripts();
    expect(scripts.start).toBe('node index.js');
    expect(scripts.dev).toBe('nodemon index.js');
    expect(scripts.test).toBe('vitest');
    expect(scripts.build).toBe('tsc');
    expect(scripts.lint).toBe('eslint .');
  });

  it('should know how to run custom script', () => {
    const cmd = runCustomScript();
    expect(cmd).toBe('npm run dev');
  });

  it('should create scripts with hooks', () => {
    const scripts = createScriptsWithHooks();
    expect(scripts.build).toBe('tsc');
    expect(scripts.prebuild).toMatch(/rm.*dist/);
    expect(scripts.postbuild).toMatch(/cp.*package\.json.*dist/);
  });

  it('should pass arguments to script', () => {
    const cmd = passArgumentsToScript();
    expect(cmd).toBe('npm run test -- --coverage');
  });

  it('should use environment variables', () => {
    const scripts = useEnvironmentVariables();
    expect(scripts.start).toContain('NODE_ENV=production');
    expect(scripts.dev).toContain('NODE_ENV=development');
  });

  it('should chain commands', () => {
    const scripts = chainCommands();
    expect(scripts.check).toContain('eslint');
    expect(scripts.check).toContain('vitest');
    expect(scripts.check).toContain('tsc');
    expect(scripts.check).toMatch(/&&|;/);
  });

  it('should know start script is special', () => {
    expect(specialStartScript()).toBe('b');
  });

  it('should know test script is special', () => {
    expect(specialTestScript()).toBe('b');
  });
});
