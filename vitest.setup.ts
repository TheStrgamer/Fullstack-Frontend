/// <reference types="vitest" />

import { beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Initialize Pinia for tests
setActivePinia(createPinia());

// Mock IntersectionObserver for tests
global.IntersectionObserver = class {
  root = null;
  rootMargin = '';
  thresholds = [];

  constructor() {}

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

// Example: Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});