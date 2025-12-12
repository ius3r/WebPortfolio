import { afterEach, beforeEach, vi } from 'vitest';

// React 18+/19 expects this flag in test environments.
// See: https://react.dev/reference/react/act
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  // jsdom provides localStorage, but keep tests isolated
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});
