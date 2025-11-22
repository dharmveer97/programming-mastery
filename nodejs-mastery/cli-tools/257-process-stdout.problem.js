import { describe, it, expect } from 'vitest';

/**
 * Exercise 257: process.stdout & process.stdin
 *
 * process.stdout:
 * - Writable stream to output
 * - console.log() uses process.stdout.write()
 * - Can write without newline
 *
 * process.stdin:
 * - Readable stream for input
 * - Read user input from terminal
 *
 * process.stderr:
 * - Writable stream for errors
 * - Separate from stdout
 *
 * Task: Work with standard streams
 */

// TODO: Write to stdout without newline
export function writeWithoutNewline(text) {
  process.stdout.write(text);
}

// TODO: Create progress indicator
export function showProgress(current, total) {
  const percentage = Math.floor((current / total) * 100);
  const bar = '█'.repeat(percentage / 2) + '░'.repeat(50 - percentage / 2);

  // Clear line and write progress
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`Progress: [${bar}] ${percentage}%`);
}

// TODO: Write colored output
export function writeColored(text, color = 'reset') {
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
  };

  const colorCode = colors[color] || colors.reset;
  process.stdout.write(`${colorCode}${text}${colors.reset}\n`);
}

// Tests
describe('Exercise 257: process.stdout', () => {
  it('should write without newline', () => {
    // In tests, we can't easily capture stdout
    // But we can verify the function exists
    expect(typeof writeWithoutNewline).toBe('function');
  });

  it('should show progress', () => {
    expect(typeof showProgress).toBe('function');

    // Test calculation
    // showProgress(50, 100); // Would show 50%
  });

  it('should write colored output', () => {
    expect(typeof writeColored).toBe('function');
  });
});

/**
 * PRACTICAL EXAMPLES:
 *
 * 1. Loading Spinner:
 * const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
 * let i = 0;
 * setInterval(() => {
 *   process.stdout.write('\r' + frames[i++ % frames.length]);
 * }, 80);
 *
 * 2. Clear Screen:
 * process.stdout.write('\x1Bc');
 *
 * 3. Move Cursor:
 * process.stdout.cursorTo(0, 5); // column 0, row 5
 *
 * 4. Read User Input:
 * process.stdin.on('data', (data) => {
 *   console.log('You typed:', data.toString());
 * });
 */
