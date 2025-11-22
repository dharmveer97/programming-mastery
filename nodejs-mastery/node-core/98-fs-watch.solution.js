import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Exercise 98: File System - Watching for Changes - SOLUTION
 */

const TEST_DIR = path.join(process.cwd(), 'test-watch');

beforeAll(() => {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR);
  }
});

afterAll(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

export function watchFile(filePath, onChange) {
  const watcher = fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      onChange();
    }
  });
  return watcher;
}

export function watchDirectory(dirPath, onChange) {
  const watcher = fs.watch(dirPath, (eventType, filename) => {
    onChange(eventType, filename);
  });
  return watcher;
}

export function watchFilePolling(filePath, onChange) {
  fs.watchFile(filePath, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      onChange();
    }
  });

  return {
    close: () => fs.unwatchFile(filePath)
  };
}

export function watchWithEventType(filePath, onEvent) {
  const watcher = fs.watch(filePath, (eventType, filename) => {
    onEvent(eventType, filename);
  });
  return watcher;
}

export class FileWatcher {
  constructor(filePath) {
    this.filePath = filePath;
    this.watcher = null;
    this.listeners = [];
  }

  start() {
    this.watcher = fs.watch(this.filePath, (eventType) => {
      if (eventType === 'change') {
        this.listeners.forEach(listener => listener());
      }
    });
  }

  on(event, callback) {
    if (event === 'change') {
      this.listeners.push(callback);
    }
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
    this.listeners = [];
  }
}

// Tests
describe('Exercise 98: fs.watch - Solution', () => {
  it('should watch file for changes', async () => {
    const filePath = path.join(TEST_DIR, 'watch-test.txt');
    fs.writeFileSync(filePath, 'initial');

    const onChange = vi.fn();
    const watcher = watchFile(filePath, onChange);

    await new Promise(resolve => setTimeout(resolve, 100));

    fs.writeFileSync(filePath, 'modified');

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
