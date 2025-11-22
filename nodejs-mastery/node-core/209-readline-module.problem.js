import { describe, it, expect, vi } from 'vitest';
import readline from 'readline';
import { Readable, Writable } from 'stream';

/**
 * Exercise 209: Readline Module - Interactive CLI Input
 *
 * The readline module provides an interface for reading data from a Readable stream
 * (like process.stdin) one line at a time. It's essential for creating interactive
 * command-line applications.
 *
 * Key methods:
 * - readline.createInterface() - creates a readline interface
 * - rl.question() - prompts user and gets input
 * - rl.on('line', callback) - event when line is read
 * - rl.on('close', callback) - event when interface is closed
 * - rl.close() - closes the interface
 * - rl.prompt() - displays the prompt
 *
 * Task: Work with readline for CLI interactions
 */

// TODO: Create a readline interface
// Create and return a readline interface with given input and output streams
export function createReadlineInterface(input, output) {
  // Your code here
}

// TODO: Read a single line from input
// Create readline interface and read one line
// Return a promise that resolves with the line content
export function readLine(input, output) {
  // Your code here
}

// TODO: Ask a question and get answer
// Use rl.question to prompt user and return the answer as a promise
export function askQuestion(rl, question) {
  // Your code here
}

// TODO: Read multiple lines until 'exit' is typed
// Listen to 'line' events and collect lines in an array
// Stop when user types 'exit' and return the array of lines
export function readMultipleLines(input, output) {
  // Your code here
}

// TODO: Create an interactive prompt
// Display a prompt and handle commands:
// - 'help': return 'Available commands: help, status, exit'
// - 'status': return 'System is running'
// - 'exit': close the interface and return 'Goodbye'
// - other: return 'Unknown command'
// Return a promise that resolves with array of all responses
export function interactivePrompt(input, output) {
  // Your code here
}

// TODO: Process lines with transformation
// Read lines and transform them (e.g., convert to uppercase)
// Return array of transformed lines when stream ends
export function processLinesWithTransform(input, output, transformFn) {
  // Your code here
}

// TODO: Count lines in a stream
// Use readline to count total number of lines in input stream
// Return the count when stream ends
export function countLines(input) {
  // Your code here
}

// TODO: Create a simple CLI calculator
// Read math expressions line by line (e.g., "2 + 3", "10 * 5")
// Evaluate each expression and collect results
// Stop when 'quit' is entered
// Return array of results
export function simpleCalculator(input, output) {
  // Your code here
}

// Tests
describe('Exercise 209: Readline Module', () => {
  it('should create readline interface', () => {
    const input = new Readable({ read() {} });
    const output = new Writable({ write() {} });

    const rl = createReadlineInterface(input, output);
    expect(rl).toBeDefined();
    expect(typeof rl.on).toBe('function');
    expect(typeof rl.close).toBe('function');
    rl.close();
  });

  it('should read a single line', async () => {
    const input = new Readable({ read() {} });
    const output = new Writable({ write() {} });

    // Simulate user input
    setImmediate(() => {
      input.push('Hello World\n');
      input.push(null);
    });

    const line = await readLine(input, output);
    expect(line).toBe('Hello World');
  });

  it('should ask a question', async () => {
    const input = new Readable({ read() {} });
    const output = new Writable({ write() {} });
    const rl = readline.createInterface({ input, output });

    // Simulate user input
    setImmediate(() => {
      input.push('Alice\n');
    });

    const answer = await askQuestion(rl, 'What is your name? ');
    expect(answer).toBe('Alice');
    rl.close();
  });

  it('should read multiple lines until exit', async () => {
    const input = new Readable({ read() {} });
    const output = new Writable({ write() {} });

    setImmediate(() => {
      input.push('line 1\n');
      input.push('line 2\n');
      input.push('line 3\n');
      input.push('exit\n');
    });

    const lines = await readMultipleLines(input, output);
    expect(lines).toEqual(['line 1', 'line 2', 'line 3']);
  });

  it('should handle interactive prompt', async () => {
    const input = new Readable({ read() {} });
    const output = new Writable({ write() {} });

    setImmediate(() => {
      input.push('help\n');
      input.push('status\n');
      input.push('unknown\n');
      input.push('exit\n');
    });

    const responses = await interactivePrompt(input, output);
    expect(responses).toEqual([
      'Available commands: help, status, exit',
      'System is running',
      'Unknown command',
      'Goodbye'
    ]);
  });

  it('should process lines with transformation', async () => {
    const input = new Readable({ read() {} });
    const output = new Writable({ write() {} });

    setImmediate(() => {
      input.push('hello\n');
      input.push('world\n');
      input.push(null);
    });

    const transformed = await processLinesWithTransform(
      input,
      output,
      (line) => line.toUpperCase()
    );

    expect(transformed).toEqual(['HELLO', 'WORLD']);
  });

  it('should count lines', async () => {
    const input = new Readable({ read() {} });

    setImmediate(() => {
      input.push('line 1\n');
      input.push('line 2\n');
      input.push('line 3\n');
      input.push(null);
    });

    const count = await countLines(input);
    expect(count).toBe(3);
  });

  it('should create simple calculator', async () => {
    const input = new Readable({ read() {} });
    const output = new Writable({ write() {} });

    setImmediate(() => {
      input.push('2 + 3\n');
      input.push('10 * 5\n');
      input.push('100 / 4\n');
      input.push('quit\n');
    });

    const results = await simpleCalculator(input, output);
    expect(results).toEqual([5, 50, 25]);
  });
});
