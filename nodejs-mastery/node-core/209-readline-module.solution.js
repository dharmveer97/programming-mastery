import { describe, it, expect, vi } from 'vitest';
import readline from 'readline';
import { Readable, Writable } from 'stream';

/**
 * Exercise 209: Readline Module - Interactive CLI Input - SOLUTION
 */

export function createReadlineInterface(input, output) {
  return readline.createInterface({ input, output });
}

export function readLine(input, output) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output });

    rl.on('line', (line) => {
      resolve(line);
      rl.close();
    });
  });
}

export function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

export function readMultipleLines(input, output) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output });
    const lines = [];

    rl.on('line', (line) => {
      if (line === 'exit') {
        rl.close();
      } else {
        lines.push(line);
      }
    });

    rl.on('close', () => {
      resolve(lines);
    });
  });
}

export function interactivePrompt(input, output) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output });
    const responses = [];

    rl.on('line', (line) => {
      let response;

      switch (line) {
        case 'help':
          response = 'Available commands: help, status, exit';
          break;
        case 'status':
          response = 'System is running';
          break;
        case 'exit':
          response = 'Goodbye';
          responses.push(response);
          rl.close();
          return;
        default:
          response = 'Unknown command';
      }

      responses.push(response);
    });

    rl.on('close', () => {
      resolve(responses);
    });
  });
}

export function processLinesWithTransform(input, output, transformFn) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output });
    const transformed = [];

    rl.on('line', (line) => {
      transformed.push(transformFn(line));
    });

    rl.on('close', () => {
      resolve(transformed);
    });
  });
}

export function countLines(input) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input });
    let count = 0;

    rl.on('line', () => {
      count++;
    });

    rl.on('close', () => {
      resolve(count);
    });
  });
}

export function simpleCalculator(input, output) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output });
    const results = [];

    rl.on('line', (line) => {
      if (line === 'quit') {
        rl.close();
        return;
      }

      // Evaluate the expression
      try {
        const result = eval(line);
        results.push(result);
      } catch (err) {
        // Invalid expression
      }
    });

    rl.on('close', () => {
      resolve(results);
    });
  });
}

// Tests
describe('Exercise 209: Readline Module - Solution', () => {
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
