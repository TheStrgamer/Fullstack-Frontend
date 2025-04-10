import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUserStore } from '../UserStore';
import { getJwtToken } from '@/services/authService';
import { isUserAdmin } from '@/services/httpService';

vi.mock('@/services/authService', () => ({
  getJwtToken: vi.fn(),
}));

vi.mock('@/services/httpService', () => ({
  isUserAdmin: vi.fn(),
}));

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    sessionStorage.clear();
  });

  it('initializes with default state', () => {
    const store = useUserStore();
    expect(store.jwtToken).toBe('');
    expect(store.expiresAt).toBeGreaterThan(0);
    expect(store.email).toBe('');
  });

  it('saves token and user info in store and sessionStorage', async () => {
    const store = useUserStore();
    vi.mocked(getJwtToken).mockResolvedValue({ token: 'test-token', expiration: Date.now() + 10000 });
    vi.mocked(isUserAdmin).mockResolvedValue(true);

    const result = await store.getTokenAndSaveInStore('test@example.com', 'password');

    expect(result).toBe(true);
    expect(store.jwtToken).toBe('test-token');
    expect(store.email).toBe('test@example.com');
    expect(sessionStorage.getItem('jwtToken')).toBe('test-token');
    expect(sessionStorage.getItem('email')).toBe('test@example.com');
    expect(sessionStorage.getItem('isAdmin')).toBe('true');
  });

  it('logs out and clears state and sessionStorage', () => {
    const store = useUserStore();
    store.jwtToken = 'test-token';
    store.email = 'test@example.com';
    sessionStorage.setItem('jwtToken', 'test-token');
    sessionStorage.setItem('email', 'test@example.com');

    store.logout();

    expect(store.jwtToken).toBe('');
    expect(store.email).toBe('');
    expect(sessionStorage.getItem('jwtToken')).toBeNull();
    expect(sessionStorage.getItem('email')).toBeNull();
  });

  it('checks if token is expired', () => {
    const store = useUserStore();
    store.expiresAt = Date.now() - 1000;
    expect(store.isTokenExpired()).toBe(true);

    store.expiresAt = Date.now() + 1000;
    expect(store.isTokenExpired()).toBe(false);
  });

  it('refreshes token if needed and logs out if expired', async () => {
    const store = useUserStore();
    const logoutSpy = vi.spyOn(store, 'logout');

    store.expiresAt = Date.now() - 1000;
    await store.refreshTokenIfNeeded();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('checks if user is authenticated', () => {
    const store = useUserStore();
    store.jwtToken = 'test-token';
    store.expiresAt = Date.now() + 1000;

    expect(store.isAuthenticated()).toBe(true);

    store.expiresAt = Date.now() - 1000;
    expect(store.isAuthenticated()).toBe(false);
  });

  it('checks if user is admin', () => {
    sessionStorage.setItem('isAdmin', 'true');
    const store = useUserStore();

    expect(store.isUserAdmin()).toBe(true);

    sessionStorage.setItem('isAdmin', 'false');
    expect(store.isUserAdmin()).toBe(false);
  });
});