import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useItemStore } from '../ItemStore';

vi.mock('../../services/itemService', () => ({
  itemServices: () => ({
    createItem: vi.fn(() => Promise.resolve({ success: true })),
    updateItem: vi.fn(() => Promise.resolve({ success: true })),
    deleteItem: vi.fn(() => Promise.resolve({ success: true })),
    fetchItemFromAPI: vi.fn(() => Promise.resolve({
      id: 1,
      title: 'Test Item',
      sale_status: 'available',
      price: 100,
      full_description: 'Full description of the item',
      brief_description: 'Brief description',
      categoryName: 'Category 1',
      conditionName: 'New',
      size: 'M',
      imageUrls: ['url1', 'url2'],
      created_at: '2025-04-10',
      updated_at: '2025-04-11',
      latitude: 59.91,
      longitude: 10.75,
      creatorId: 'user123',
    })),
  }),
}));

describe('ItemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const store = useItemStore();
    expect(store.itemId).toBe(0);
    expect(store.title).toBe('');
    expect(store.sale_status).toBe('');
    expect(store.price).toBe(0.0);
    expect(store.full_description).toBe('');
    expect(store.brief_description).toBe('');
    expect(store.categoryName).toBe('');
    expect(store.conditionName).toBe('');
    expect(store.size).toBe('');
    expect(store.imageUrls).toEqual([]);
    expect(store.created_at).toBe('');
    expect(store.updated_at).toBe('');
    expect(store.latitude).toBe(0.0);
    expect(store.longitude).toBe(0.0);
    expect(store.creatorId).toBe('');
  });

  it('sets item properties correctly', () => {
    const store = useItemStore();
    const item = {
      id: 1,
      title: 'Test Item',
      sale_status: 'available',
      price: 100,
      full_description: 'Full description of the item',
      brief_description: 'Brief description',
      categoryName: 'Category 1',
      conditionName: 'New',
      size: 'M',
      imageUrls: ['url1', 'url2'],
      created_at: '2025-04-10',
      updated_at: '2025-04-11',
      latitude: 59.91,
      longitude: 10.75,
      creatorId: 'user123',
    };

    store.setItem(item);

    expect(store.itemId).toBe(1);
    expect(store.title).toBe('Test Item');
    expect(store.sale_status).toBe('available');
    expect(store.price).toBe(100);
    expect(store.full_description).toBe('Full description of the item');
    expect(store.brief_description).toBe('Brief description');
    expect(store.categoryName).toBe('Category 1');
    expect(store.conditionName).toBe('New');
    expect(store.size).toBe('M');
    expect(store.imageUrls).toEqual(['url1', 'url2']);
    expect(store.created_at).toBe('2025-04-10');
    expect(store.updated_at).toBe('2025-04-11');
    expect(store.latitude).toBe(59.91);
    expect(store.longitude).toBe(10.75);
    expect(store.creatorId).toBe('user123');
  });

  it('resets state correctly', () => {
    const store = useItemStore();
    store.setItem({
      id: 1,
      title: 'Test Item',
      sale_status: 'available',
      price: 100,
      full_description: 'Full description of the item',
      brief_description: 'Brief description',
      categoryName: 'Category 1',
      conditionName: 'New',
      size: 'M',
      imageUrls: ['url1', 'url2'],
      created_at: '2025-04-10',
      updated_at: '2025-04-11',
      latitude: 59.91,
      longitude: 10.75,
      creatorId: 'user123',
    });

    store.resetState();

    expect(store.itemId).toBe(0);
    expect(store.title).toBe('');
    expect(store.sale_status).toBe('');
    expect(store.price).toBe(0.0);
    expect(store.full_description).toBe('');
    expect(store.brief_description).toBe('');
    expect(store.categoryName).toBe('');
    expect(store.conditionName).toBe('');
    expect(store.size).toBe('');
    expect(store.imageUrls).toEqual([]);
    expect(store.created_at).toBe('');
    expect(store.updated_at).toBe('');
    expect(store.latitude).toBe(0.0);
    expect(store.longitude).toBe(0.0);
    expect(store.creatorId).toBe('');
  });

  it('fetches item and updates state', async () => {
    const store = useItemStore();
    await store.fetchItem('1');

    expect(store.itemId).toBe(1);
    expect(store.title).toBe('Test Item');
    expect(store.sale_status).toBe('available');
    expect(store.price).toBe(100);
    expect(store.full_description).toBe('Full description of the item');
    expect(store.brief_description).toBe('Brief description');
    expect(store.categoryName).toBe('Category 1');
    expect(store.conditionName).toBe('New');
    expect(store.size).toBe('M');
    expect(store.imageUrls).toEqual(['url1', 'url2']);
    expect(store.created_at).toBe('2025-04-10');
    expect(store.updated_at).toBe('2025-04-11');
    expect(store.latitude).toBe(59.91);
    expect(store.longitude).toBe(10.75);
    expect(store.creatorId).toBe('user123');
  });
});