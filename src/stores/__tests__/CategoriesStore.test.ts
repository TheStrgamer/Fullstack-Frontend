import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCategoriesStore } from '../CategoriesStore';

vi.mock('../../services/itemService', () => ({
  itemServices: () => ({
    fetchCategoriesFromAPI: vi.fn(() => Promise.resolve([
      { id: 1, name: 'Category 1', description: 'Description 1', parent_category: null },
      { id: 2, name: 'Category 2', description: 'Description 2', parent_category: 1 },
    ])),
  }),
}));

describe('CategoriesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const store = useCategoriesStore();
    expect(store.categories).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('fetches categories and updates state', async () => {
    const store = useCategoriesStore();
    await store.fetchCategories();

    expect(store.categories).toEqual([
      { id: 1, name: 'Category 1', description: 'Description 1', parent_category: null },
      { id: 2, name: 'Category 2', description: 'Description 2', parent_category: 1 },
    ]);
    expect(store.isLoading).toBe(false);
  });

  it('handles getCategories correctly', () => {
    const store = useCategoriesStore();
    store.categories = [
      { id: 1, name: 'Category 1', description: 'Description 1', parent_category: null },
    ];

    const categories = store.getCategories();
    expect(categories).toEqual([
      { id: 1, name: 'Category 1', description: 'Description 1', parent_category: null },
    ]);
  });
});