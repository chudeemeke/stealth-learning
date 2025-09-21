import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { enableMapSet } from 'immer';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Enable Immer plugins
enableMapSet();

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock navigator
Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    ...window.navigator,
    vibrate: vi.fn(),
    onLine: true,
  },
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock Audio
global.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

// Mock Framer Motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: 'div',
      span: 'span',
      p: 'p',
      a: 'a',
      button: 'button',
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      img: 'img',
      section: 'section',
      article: 'article',
      header: 'header',
      footer: 'footer',
      nav: 'nav',
      main: 'main',
    },
    useInView: vi.fn().mockReturnValue([vi.fn(), false]),
    AnimatePresence: ({ children }: any) => children,
    useAnimation: vi.fn().mockReturnValue({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
  };
});