/**
 * EXERCISE 155: npm Scripts
 *
 * Master npm scripts for task automation.
 *
 * npm scripts are shortcuts defined in package.json
 * that run commands using `npm run <script-name>`
 *
 * TOPICS:
 * - Defining scripts in package.json
 * - Running scripts with npm run
 * - Pre and post hooks
 * - Passing arguments to scripts
 * - Environment variables in scripts
 *
 * YOUR TASK:
 * Create and use npm scripts effectively.
 */

import { describe, it, expect } from 'vitest';

/**
 * Q1: Create npm scripts for common tasks
 */
export const createNpmScripts = () => {
  // TODO: Return package.json scripts object with:
  // - start: Start production server (node index.js)
  // - dev: Start development server with nodemon (nodemon index.js)
  // - test: Run tests (vitest)
  // - build: Build the project (tsc)
  // - lint: Run linter (eslint .)

  return {};
};

/**
 * Q2: How do you run a custom npm script named "dev"?
 */
export const runCustomScript = () => {
  // TODO: Return the command to run the "dev" script
  return '';
};

/**
 * Q3: What are pre and post hooks?
 * Create scripts with hooks.
 */
export const createScriptsWithHooks = () => {
  // TODO: Return scripts object with:
  // - build: "tsc"
  // - prebuild: "rm -rf dist" (runs BEFORE build)
  // - postbuild: "cp package.json dist/" (runs AFTER build)
  //
  // When you run "npm run build", all three run in order:
  // 1. prebuild
  // 2. build
  // 3. postbuild

  return {};
};

/**
 * Q4: How to pass arguments to npm scripts?
 * Example: npm run test -- --watch
 */
export const passArgumentsToScript = () => {
  // TODO: Return the command to run "test" script with "--coverage" argument
  // The script is: "test": "vitest"
  // You want to run: vitest --coverage

  return '';
};

/**
 * Q5: Use environment variables in scripts
 */
export const useEnvironmentVariables = () => {
  // TODO: Return a scripts object that sets NODE_ENV
  // - start: Run with NODE_ENV=production
  // - dev: Run with NODE_ENV=development
  //
  // Hint: Use NODE_ENV=value before the command

  return {};
};

/**
 * Q6: Chain multiple commands in one script
 */
export const chainCommands = () => {
  // TODO: Return a script that:
  // 1. Runs lint (eslint .)
  // 2. Then runs tests (vitest run)
  // 3. Then builds (tsc)
  //
  // Use && to chain commands (stops on first error)
  // Use ; to run all regardless of errors

  return {
    "check": "" // Fill this in
  };
};

/**
 * Q7: What's special about the "start" script?
 */
export const specialStartScript = () => {
  // TODO: Choose correct answer (return the letter)
  // a) It runs automatically when you install packages
  // b) You can run it with "npm start" (no "run" needed)
  // c) It's required in every package.json
  // d) It always runs in production mode

  return '';
};

/**
 * Q8: What's special about the "test" script?
 */
export const specialTestScript = () => {
  // TODO: Choose correct answer (return the letter)
  // a) It's required in package.json
  // b) You can run it with "npm test" (no "run" needed)
  // c) It only works with Jest
  // d) It runs before installing packages

  return '';
};

// ============================================
// TESTS - Don't modify below
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
    expect(scripts.check).toMatch(/&&|;/); // Must use && or ;
  });

  it('should know start script is special', () => {
    expect(specialStartScript()).toBe('b');
  });

  it('should know test script is special', () => {
    expect(specialTestScript()).toBe('b');
  });
});
