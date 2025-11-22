/**
 * EXERCISE 153: package.json Deep Dive
 *
 * Master the package.json file - the heart of every Node.js project.
 *
 * TOPICS:
 * - Required fields (name, version)
 * - Dependencies vs devDependencies
 * - Scripts
 * - Main entry point
 * - Package metadata
 *
 * YOUR TASK:
 * Create and understand package.json structure.
 */

import { describe, it, expect } from 'vitest';

/**
 * Q1: Create a valid package.json object
 * Must include required fields and common optional fields.
 */
export const createPackageJson = () => {
  // TODO: Return a valid package.json object with:
  // - name: "my-awesome-app"
  // - version: "1.0.0"
  // - description: "A Node.js application"
  // - main: "index.js"
  // - author: "Your Name"
  // - license: "MIT"

  return {};
};

/**
 * Q2: Add dependencies to package.json
 * Distinguish between production and development dependencies.
 */
export const addDependencies = () => {
  // TODO: Return a package.json object with:
  // Production dependencies: express (^4.18.0), mongoose (^7.0.0)
  // Dev dependencies: vitest (^0.34.0), eslint (^8.0.0)

  return {
    name: "my-app",
    version: "1.0.0",
    dependencies: {},
    devDependencies: {}
  };
};

/**
 * Q3: Add npm scripts
 * Scripts are shortcuts for common tasks.
 */
export const addScripts = () => {
  // TODO: Return a package.json with scripts:
  // - start: "node index.js"
  // - dev: "nodemon index.js"
  // - test: "vitest"
  // - lint: "eslint ."

  return {
    name: "my-app",
    version: "1.0.0",
    scripts: {}
  };
};

/**
 * Q4: What is the 'main' field used for?
 * Return the correct description.
 */
export const explainMainField = () => {
  // TODO: Choose the correct answer (return the letter)
  // a) The main CSS file
  // b) The entry point when someone requires your package
  // c) The first script to run
  // d) The main configuration file

  return '';
};

/**
 * Q5: What does the caret (^) mean in version "^4.18.0"?
 * Return the correct description.
 */
export const explainCaretVersion = () => {
  // TODO: Choose the correct answer (return the letter)
  // a) Exact version only (4.18.0)
  // b) Any version greater than 4.18.0
  // c) Compatible version (allows minor and patch updates: 4.x.x)
  // d) Major version 4 or higher

  return '';
};

/**
 * Q6: What does the tilde (~) mean in version "~4.18.0"?
 * Return the correct description.
 */
export const explainTildeVersion = () => {
  // TODO: Choose the correct answer (return the letter)
  // a) Exact version only
  // b) Allows patch updates only (4.18.x)
  // c) Allows minor updates (4.x.x)
  // d) Any version

  return '';
};

/**
 * Q7: Create package.json with type: "module" for ES Modules
 */
export const createESMPackage = () => {
  // TODO: Return a package.json that enables ES Modules (import/export)
  // Hint: Add "type": "module" field

  return {
    name: "esm-app",
    version: "1.0.0"
    // Add type field here
  };
};

/**
 * Q8: What's the difference between dependencies and devDependencies?
 */
export const explainDependencyTypes = () => {
  // TODO: Return an object with explanations
  return {
    dependencies: '',      // When are these installed?
    devDependencies: ''    // When are these installed?
  };
};

// ============================================
// TESTS - Don't modify below
// ============================================

describe('package.json Deep Dive', () => {
  it('should create valid package.json', () => {
    const pkg = createPackageJson();
    expect(pkg.name).toBe('my-awesome-app');
    expect(pkg.version).toBe('1.0.0');
    expect(pkg.description).toBe('A Node.js application');
    expect(pkg.main).toBe('index.js');
    expect(pkg.author).toBeTruthy();
    expect(pkg.license).toBe('MIT');
  });

  it('should add dependencies correctly', () => {
    const pkg = addDependencies();
    expect(pkg.dependencies.express).toBe('^4.18.0');
    expect(pkg.dependencies.mongoose).toBe('^7.0.0');
    expect(pkg.devDependencies.vitest).toBe('^0.34.0');
    expect(pkg.devDependencies.eslint).toBe('^8.0.0');
  });

  it('should add scripts', () => {
    const pkg = addScripts();
    expect(pkg.scripts.start).toBe('node index.js');
    expect(pkg.scripts.dev).toBe('nodemon index.js');
    expect(pkg.scripts.test).toBe('vitest');
    expect(pkg.scripts.lint).toBe('eslint .');
  });

  it('should explain main field', () => {
    expect(explainMainField()).toBe('b');
  });

  it('should explain caret version', () => {
    expect(explainCaretVersion()).toBe('c');
  });

  it('should explain tilde version', () => {
    expect(explainTildeVersion()).toBe('b');
  });

  it('should create ESM package.json', () => {
    const pkg = createESMPackage();
    expect(pkg.type).toBe('module');
  });

  it('should explain dependency types', () => {
    const result = explainDependencyTypes();
    expect(result.dependencies.toLowerCase()).toContain('production');
    expect(result.devDependencies.toLowerCase()).toContain('development');
  });
});
