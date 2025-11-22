/**
 * SOLUTION 153: package.json Deep Dive
 */

import { describe, it, expect } from 'vitest';

export const createPackageJson = () => {
  return {
    name: "my-awesome-app",
    version: "1.0.0",
    description: "A Node.js application",
    main: "index.js",
    author: "Your Name",
    license: "MIT"
  };
};

export const addDependencies = () => {
  return {
    name: "my-app",
    version: "1.0.0",
    dependencies: {
      express: "^4.18.0",
      mongoose: "^7.0.0"
    },
    devDependencies: {
      vitest: "^0.34.0",
      eslint: "^8.0.0"
    }
  };
};

export const addScripts = () => {
  return {
    name: "my-app",
    version: "1.0.0",
    scripts: {
      start: "node index.js",
      dev: "nodemon index.js",
      test: "vitest",
      lint: "eslint ."
    }
  };
};

export const explainMainField = () => {
  return 'b'; // The entry point when someone requires your package
};

export const explainCaretVersion = () => {
  return 'c'; // Compatible version (allows minor and patch updates: 4.x.x)
};

export const explainTildeVersion = () => {
  return 'b'; // Allows patch updates only (4.18.x)
};

export const createESMPackage = () => {
  return {
    name: "esm-app",
    version: "1.0.0",
    type: "module"  // Enables ES Modules
  };
};

export const explainDependencyTypes = () => {
  return {
    dependencies: 'Installed in production and development',
    devDependencies: 'Only installed in development (not in production)'
  };
};

// ============================================
// TESTS
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
