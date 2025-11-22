/**
 * SOLUTION 152: npm Basics
 */

import { describe, it, expect } from 'vitest';

export const installProductionDependency = () => {
  return 'npm install express';
};

export const installDevDependency = () => {
  return 'npm install vitest --save-dev';
  // Alternative: 'npm install vitest -D'
};

export const installGlobalPackage = () => {
  return 'npm install -g nodemon';
  // Alternative: 'npm install --global nodemon'
};

export const uninstallPackage = () => {
  return 'npm uninstall lodash';
  // Alternatives: 'npm remove lodash', 'npm rm lodash', 'npm un lodash'
};

export const updatePackage = () => {
  return 'npm update express';
  // Alternative: 'npm up express'
};

export const listPackages = () => {
  return 'npm list';
  // Alternatives: 'npm ls', 'npm la', 'npm ll'
};

export const categorizeDependencies = () => {
  return {
    dependencies: ['express', 'mongoose'],     // Production packages
    devDependencies: ['vitest', 'eslint']      // Development packages
  };
};

export const npmInstallBehavior = () => {
  return 'b'; // Installs all dependencies from package.json
};

// ============================================
// TESTS
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
