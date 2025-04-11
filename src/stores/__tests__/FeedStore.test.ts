import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFeedStore } from '../FeedStore';
import { useUserStore } from '../UserStore';
import * as FeedService from '../../services/FeedService';

const mockIsAuthenticated = vi.fn();
vi.mock('../UserStore', () => {
  return {
    useUserStore: vi.fn(() => ({
      isAuthenticated: mockIsAuthenticated,
    })),
  };
});

vi.mock('../../services/FeedService', () => ({
  fetchRecommendedItems: vi.fn(() => Promise.resolve(['Item 1', 'Item 2'])),
  fetchRandomItems: vi.fn(() => Promise.resolve(['Random Item 1', 'Random Item 2'])),
}));

describe('FeedStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const store = useFeedStore();
    expect(store.recommendedItems).toEqual([]);
  });

  it('fetches recommended items for authenticated users', async () => {
    const store = useFeedStore();
    const userStore = useUserStore();
    mockIsAuthenticated.mockReturnValue(true);

    await store.fetchRecommendedItems(2);

    expect(store.recommendedItems).toEqual(['Item 1', 'Item 2']);
  });

  it('fetches random items for unauthenticated users', async () => {
    const store = useFeedStore();
    const userStore = useUserStore();
    mockIsAuthenticated.mockReturnValue(false);

    await store.fetchRecommendedItems(2);

    expect(store.recommendedItems).toEqual(['Random Item 1', 'Random Item 2']);
  });

  it('handles errors gracefully when fetching items', async () => {
    const store = useFeedStore();
    const userStore = useUserStore();
    mockIsAuthenticated.mockReturnValue(true);

    vi.mocked(FeedService.fetchRecommendedItems).mockRejectedValue(new Error('Fetch error'));

    await store.fetchRecommendedItems(2);

    expect(store.recommendedItems).toEqual([]);
  });
});