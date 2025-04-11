import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useConditionStore } from '../ConditionStore';

vi.mock('../../services/itemService', () => ({
  itemServices: () => ({
    fetchConditionsFromAPI: vi.fn(() => Promise.resolve([
      { id: 1, name: 'New' },
      { id: 2, name: 'Used' },
    ])),
  }),
}));

describe('ConditionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const store = useConditionStore();
    expect(store.conditions).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('fetches conditions and updates state', async () => {
    const store = useConditionStore();
    await store.fetchConditions();

    expect(store.conditions).toEqual([
      { id: 1, name: 'New' },
      { id: 2, name: 'Used' },
    ]);
    expect(store.isLoading).toBe(false);
  });

  it('does not fetch conditions if already loaded and force is false', async () => {
    const store = useConditionStore();
    store.conditions = [
      { id: 1, name: 'New' },
    ];

    await store.fetchConditions();

    expect(store.conditions).toEqual([
      { id: 1, name: 'New' },
    ]);
  });

  it('fetches conditions if force is true', async () => {
    const store = useConditionStore();
    store.conditions = [
      { id: 1, name: 'New' },
    ];

    await store.fetchConditions(true);

    expect(store.conditions).toEqual([
      { id: 1, name: 'New' },
      { id: 2, name: 'Used' },
    ]);
  });
});