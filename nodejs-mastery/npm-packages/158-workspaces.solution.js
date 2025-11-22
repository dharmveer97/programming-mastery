/**
 * SOLUTION 158: npm Workspaces
 */

import { describe, it, expect } from 'vitest';

export const whatIsMonorepo = () => {
  return 'b'; // A single repository containing multiple packages/projects
};

export const configureWorkspaces = () => {
  return {
    name: 'my-monorepo',
    version: '1.0.0',
    workspaces: [
      'packages/*',
      'apps/*'
    ]
  };
};

export const workspaceBenefits = () => {
  return [
    'Shared dependencies reduce duplication and disk space',
    'Easier to make cross-package changes',
    'Simplified dependency management',
    'Automatic linking of local packages',
    'Consistent versions across packages',
    'Single npm install for entire monorepo'
  ];
};

export const installAllWorkspaces = () => {
  return 'npm install';
  // Running npm install at root installs all workspace dependencies
};

export const runWorkspaceScript = () => {
  return 'npm run test --workspace=packages/utils';
  // Alternative: npm run test -w packages/utils
};

export const runScriptAllWorkspaces = () => {
  return 'npm run build --workspaces';
  // Alternative: npm run build -ws
};

export const workspaceStructure = () => {
  return {
    rootFiles: [
      'package.json',
      'package-lock.json',
      'node_modules'
    ],
    workspaceFolders: [
      'packages/*',
      'apps/*',
      'tools/*'
    ]
  };
};

export const sharedDependencies = () => {
  return 'b'; // Installs it once in root node_modules and shares it
};

// ============================================
// TESTS
// ============================================

describe('npm Workspaces', () => {
  it('should understand what a monorepo is', () => {
    expect(whatIsMonorepo()).toBe('b');
  });

  it('should configure workspaces correctly', () => {
    const config = configureWorkspaces();
    expect(config).toHaveProperty('workspaces');
    expect(Array.isArray(config.workspaces)).toBe(true);
    expect(config.workspaces.length).toBeGreaterThan(0);
  });

  it('should know workspace benefits', () => {
    const benefits = workspaceBenefits();
    expect(benefits.length).toBeGreaterThanOrEqual(3);
    expect(benefits.some(b => b.toLowerCase().includes('share') || b.toLowerCase().includes('depend'))).toBe(true);
  });

  it('should install all workspaces', () => {
    const cmd = installAllWorkspaces();
    expect(cmd).toMatch(/npm (install|i)/);
  });

  it('should run script in specific workspace', () => {
    const cmd = runWorkspaceScript();
    expect(cmd).toMatch(/npm run test --workspace=.*packages\/utils/);
  });

  it('should run script in all workspaces', () => {
    const cmd = runScriptAllWorkspaces();
    expect(cmd).toMatch(/npm run build --workspaces/);
  });

  it('should understand workspace structure', () => {
    const structure = workspaceStructure();
    expect(structure.rootFiles.length).toBeGreaterThan(0);
    expect(structure.workspaceFolders.length).toBeGreaterThan(0);
    expect(structure.rootFiles).toContain('package.json');
  });

  it('should understand shared dependencies', () => {
    expect(sharedDependencies()).toBe('b');
  });
});
