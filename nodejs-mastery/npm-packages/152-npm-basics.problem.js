/**
 * EXERCISE 152: npm Basics
 *
 * Learn the fundamental npm commands for package management.
 *
 * TOPICS:
 * - npm install (dependencies vs devDependencies)
 * - npm uninstall
 * - npm update
 * - npm list
 * - Global vs local packages
 *
 * YOUR TASK:
 * Implement functions that demonstrate understanding of npm commands.
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Q1: Which command installs a package as a PRODUCTION dependency?
 * Return the correct command string.
 */
export const installProductionDependency = () => {
  // TODO: Return the npm command to install 'express' as a production dependency
  // Example: "npm install express" or "npm install express --save"
  return '';
};

/**
 * Q2: Which command installs a package as a DEV dependency?
 * Return the correct command string.
 */
export const installDevDependency = () => {
  // TODO: Return the npm command to install 'vitest' as a dev dependency
  // Hint: Use --save-dev or -D flag
  return '';
};

/**
 * Q3: Which command installs a package GLOBALLY?
 * Return the correct command string.
 */
export const installGlobalPackage = () => {
  // TODO: Return the npm command to install 'nodemon' globally
  // Hint: Use -g or --global flag
  return '';
};

/**
 * Q4: Which command uninstalls a package?
 * Return the correct command string.
 */
export const uninstallPackage = () => {
  // TODO: Return the npm command to uninstall 'lodash'
  return '';
};

/**
 * Q5: Which command updates a specific package to latest version?
 * Return the correct command string.
 */
export const updatePackage = () => {
  // TODO: Return the npm command to update 'express' to latest version
  return '';
};

/**
 * Q6: Which command lists all installed packages?
 * Return the correct command string.
 */
export const listPackages = () => {
  // TODO: Return the npm command to list all installed packages
  return '';
};

/**
 * Q7: Understand the difference between dependencies and devDependencies
 * Return an object categorizing the packages.
 */
export const categorizeDependencies = () => {
  // TODO: Categorize these packages correctly:
  // - express (web framework - needed in production)
  // - vitest (testing - only needed in development)
  // - mongoose (database - needed in production)
  // - eslint (linting - only needed in development)

  return {
    dependencies: [],      // Production packages
    devDependencies: []    // Development packages
  };
};

/**
 * Q8: What happens when you run 'npm install' without package name?
 * Return the correct description.
 */
export const npmInstallBehavior = () => {
  // TODO: Choose the correct answer (return the letter)
  // a) Throws an error
  // b) Installs all dependencies from package.json
  // c) Updates all packages
  // d) Does nothing

  return '';
};

// ============================================
// TESTS - Don't modify below
// ============================================

describe('npm Basics', () => {
  it('should know how to install production dependency', () => {
    const cmd = installProductionDependency();
    expect(cmd).toMatch(/npm (i|install) express(?!\s+--save-dev|\s+-D)/);
  });

  it('should know how to install dev dependency', () => {
    const cmd = installDevDependency();
    expect(cmd).toMatch(/npm (i|install) vitest (--save-dev|-D)/);
  });

  it('should know how to install global package', () => {
    const cmd = installGlobalPackage();
    expect(cmd).toMatch(/npm (i|install) (-g|--global) nodemon|npm (i|install) nodemon (-g|--global)/);
  });

  it('should know how to uninstall package', () => {
    const cmd = uninstallPackage();
    expect(cmd).toMatch(/npm (uninstall|remove|rm|un) lodash/);
  });

  it('should know how to update package', () => {
    const cmd = updatePackage();
    expect(cmd).toMatch(/npm (update|up) express/);
  });

  it('should know how to list packages', () => {
    const cmd = listPackages();
    expect(cmd).toMatch(/npm (list|ls|la|ll)/);
  });

  it('should categorize dependencies correctly', () => {
    const result = categorizeDependencies();
    expect(result.dependencies).toContain('express');
    expect(result.dependencies).toContain('mongoose');
    expect(result.devDependencies).toContain('vitest');
    expect(result.devDependencies).toContain('eslint');
  });

  it('should understand npm install behavior', () => {
    const answer = npmInstallBehavior();
    expect(answer).toBe('b');
  });
});
