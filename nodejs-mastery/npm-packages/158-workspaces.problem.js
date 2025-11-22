/**
 * EXERCISE 158: npm Workspaces
 *
 * Learn about npm workspaces for managing monorepos.
 *
 * TOPICS:
 * - What are npm workspaces
 * - Monorepo architecture
 * - Sharing dependencies across packages
 * - Running scripts in workspaces
 * - Benefits of workspaces
 *
 * WHAT ARE NPM WORKSPACES?
 * - Feature for managing multiple packages in a single repository (monorepo)
 * - Share dependencies across packages
 * - Link local packages together
 * - Run commands across all workspaces
 * - Available in npm 7+
 *
 * YOUR TASK:
 * Understand how to use npm workspaces for monorepo management.
 */

import { describe, it, expect } from 'vitest';

/**
 * Q1: What is a monorepo?
 */
export const whatIsMonorepo = () => {
  // TODO: Choose correct answer (return the letter)
  // a) A repository with only one package
  // b) A single repository containing multiple packages/projects
  // c) A repository with read-only access
  // d) A repository for MongoDB

  return '';
};

/**
 * Q2: How do you configure workspaces in package.json?
 */
export const configureWorkspaces = () => {
  // TODO: Return a sample package.json configuration for workspaces
  // Structure should include "workspaces" field with array of paths

  return {
    name: 'my-monorepo',
    version: '1.0.0',
    // Add workspaces configuration here
  };
};

/**
 * Q3: What are the benefits of using npm workspaces?
 */
export const workspaceBenefits = () => {
  // TODO: Return an array of benefits
  // Consider: shared dependencies, easier linking, cross-package changes, etc.

  return [];
};

/**
 * Q4: How do you install dependencies for all workspaces?
 */
export const installAllWorkspaces = () => {
  // TODO: Return the npm command to install dependencies for all workspaces

  return '';
};

/**
 * Q5: How do you run a script in a specific workspace?
 */
export const runWorkspaceScript = () => {
  // TODO: Return the npm command to run 'test' script in workspace 'packages/utils'
  // Format: npm run <script> --workspace=<name>

  return '';
};

/**
 * Q6: How do you run a script in ALL workspaces?
 */
export const runScriptAllWorkspaces = () => {
  // TODO: Return the npm command to run 'build' in all workspaces

  return '';
};

/**
 * Q7: Workspace structure
 * Given a monorepo structure, identify the correct setup.
 */
export const workspaceStructure = () => {
  // TODO: Return the typical folder structure for a workspace monorepo
  // Example structure with root package.json and workspace folders

  return {
    rootFiles: [],       // Files at root level
    workspaceFolders: [] // Workspace folder names/patterns
  };
};

/**
 * Q8: How do workspaces handle shared dependencies?
 */
export const sharedDependencies = () => {
  // If multiple workspaces use the same dependency (e.g., 'lodash@4.17.21'),
  // what does npm do?

  // TODO: Choose correct answer (return the letter)
  // a) Installs it separately in each workspace
  // b) Installs it once in root node_modules and shares it
  // c) Throws a conflict error
  // d) Asks which workspace should have it

  return '';
};

// ============================================
// TESTS - Don't modify below
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
