import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 98: File System - Watching for Changes
 *
 * The fs module provides methods to monitor file system changes.
 *
 * Key methods:
 * - fs.watch(path, callback) - watches for changes (efficient, OS-dependent)
 * - fs.watchFile(path, callback) - polls file for changes (less efficient)
 * - watcher.close() - stops watching
 *
 * Events:
 * - 'change' - file content changed
 * - 'rename' - file renamed or deleted
 *
 * Task: Monitor files and directories for changes
 */

const TEST_DIR = path.join(process.cwd(), 'test-watch');

// Setup: Create test directory
beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
});

// Cleanup: Remove test files
afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

// TODO: Watch file for changes using fs.watch
export function watchFile(filePath, onChange) {
  // Your code here
  // Hint: Use fs.watch and call onChange when 'change' event fires
  // Return the watcher object so it can be closed
}

// TODO: Watch directory for changes
export function watchDirectory(dirPath, onChange) {
  // Your code here
  // Hint: Use fs.watch to monitor directory
  // Call onChange with eventType and filename
  // Return the watcher object
}

// TODO: Watch file using fs.watchFile (polling)
export function watchFilePolling(filePath, onChange) {
  // Your code here
  // Hint: Use fs.watchFile with a callback
  // Call onChange when file changes
  // Return an object with close() method that calls fs.unwatchFile
}

// TODO: Watch file and detect specific event types
export function watchWithEventType(filePath, onEvent) {
  // Your code here
  // Hint: Use fs.watch and pass both eventType and filename to onEvent
  // Return the watcher object
}

// TODO: Create a simple file watcher class
export class FileWatcher {
  constructor(filePath) {
    this.filePath = filePath;
    this.watcher = null;
    this.listeners = [];
  }

  // TODO: Start watching the file
  start() {
    // Your code here
    // Hint: Use fs.watch and notify all listeners on change
  }

  // TODO: Add change listener
  on(event, callback) {
    // Your code here
    // Hint: Add callback to listeners array
  }

  // TODO: Stop watching
  stop() {
    // Your code here
    // Hint: Close watcher and clear listeners
  }
}

// Tests
describe('Exercise 98: fs.watch', () => {
  it('should watch file for changes', async () => {
    const filePath = path.join(TEST_DIR, 'watch-test.txt');
    fs.writeFileSync(filePath, 'initial');

    const onChange = vi.fn();
    const watcher = watchFile(filePath, onChange);

    // Give watcher time to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Modify file
    fs.writeFileSync(filePath, 'modified');

    // Wait for event
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onChange).toHaveBeenCalled();
    watcher.close();
  });

  it('should watch directory for changes', async () => {
    const dirPath = path.join(TEST_DIR, 'watch-dir');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    const onChange = vi.fn();
    const watcher = watchDirectory(dirPath, onChange);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Create new file in directory
    const newFile = path.join(dirPath, 'new-file.txt');
    fs.writeFileSync(newFile, 'content');

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onChange).toHaveBeenCalled();
    watcher.close();
  });

  it('should watch file using polling', async () => {
    const filePath = path.join(TEST_DIR, 'poll-test.txt');
    fs.writeFileSync(filePath, 'initial');

    const onChange = vi.fn();
    const watcher = watchFilePolling(filePath, onChange);

    await new Promise(resolve => setTimeout(resolve, 100));

    fs.writeFileSync(filePath, 'modified');

    // Polling needs more time
    await new Promise(resolve => setTimeout(resolve, 1500));

    expect(onChange).toHaveBeenCalled();
    watcher.close();
  });

  it('should detect event types', async () => {
    const filePath = path.join(TEST_DIR, 'event-test.txt');
    fs.writeFileSync(filePath, 'initial');

    const onEvent = vi.fn();
    const watcher = watchWithEventType(filePath, onEvent);

    await new Promise(resolve => setTimeout(resolve, 100));

    fs.writeFileSync(filePath, 'modified');

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(onEvent).toHaveBeenCalled();
    const [eventType, filename] = onEvent.mock.calls[0];
    expect(eventType).toBe('change');

    watcher.close();
  });

  it('should work with FileWatcher class', async () => {
    const filePath = path.join(TEST_DIR, 'class-test.txt');
    fs.writeFileSync(filePath, 'initial');

    const watcher = new FileWatcher(filePath);
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    watcher.on('change', callback1);
    watcher.on('change', callback2);
    watcher.start();

    await new Promise(resolve => setTimeout(resolve, 100));

    fs.writeFileSync(filePath, 'modified');

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();

    watcher.stop();
  });
});
