/// <reference types="vitest" />

import { beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Initialize Pinia for tests
setActivePinia(createPinia());

// Example: Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});