import { describe, it, expect } from 'vitest';

/**
 * Exercise 147: CommonJS vs ES Modules (ESM)
 *
 * Node.js supports TWO module systems:
 *
 * 1. CommonJS (default, older):
 *    - require() for imports
 *    - module.exports for exports
 *    - Synchronous loading
 *    - .js extension
 *
 * 2. ES Modules (modern, recommended):
 *    - import/export syntax
 *    - Asynchronous loading
 *    - .mjs extension or "type": "module" in package.json
 *    - Static analysis & tree shaking
 *
 * Key Differences:
 * - CommonJS: require() is sync, can be called anywhere
 * - ESM: import must be at top level, async by nature
 * - CommonJS: exports are objects
 * - ESM: exports are bindings (live connections)
 *
 * Task: Understand both module systems
 */

// This file uses ESM (notice the import above)

// TODO: Export a function using ESM syntax
export function add(a, b) {
  return a + b;
}

// TODO: Export a constant
export const PI = 3.14159;

// TODO: Export default
export default function greet(name) {
  return `Hello, ${name}!`;
}

// CommonJS equivalent would be:
// module.exports.add = function(a, b) { return a + b; }
// module.exports.PI = 3.14159;
// module.exports = function greet(name) { return `Hello, ${name}!`; }

// Tests
describe('Exercise 147: CommonJS vs ESM', () => {
  it('should export named function (ESM)', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should export constant (ESM)', () => {
    expect(PI).toBe(3.14159);
  });

  it('should export default (ESM)', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
  });
});

/**
 * COMPARISON GUIDE:
 *
 * CommonJS:
 * ---------
 * // Importing
 * const fs = require('fs');
 * const { add } = require('./math');
 * const express = require('express');
 *
 * // Exporting
 * module.exports = { add, subtract };
 * module.exports.multiply = (a, b) => a * b;
 * exports.divide = (a, b) => a / b;
 *
 * ESM:
 * ----
 * // Importing
 * import fs from 'fs';
 * import { add } from './math.js';
 * import express from 'express';
 *
 * // Exporting
 * export { add, subtract };
 * export const multiply = (a, b) => a * b;
 * export default function divide(a, b) { return a / b; }
 *
 * WHEN TO USE:
 * - ESM: New projects, frontend code, modern Node.js
 * - CommonJS: Legacy code, some npm packages
 *
 * MIXING:
 * - ESM can import CommonJS (require works with import)
 * - CommonJS cannot import ESM directly
 */
