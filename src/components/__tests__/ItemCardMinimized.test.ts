import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemCardMinimized from '@/components/ItemCardMinimized.vue'
import { getUrlFromEndpoint } from '@/services/httpService'
import { toggleFavorite } from '@/services/favoriteService'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('@/services/favoriteService', () => ({
  toggleFavorite: vi.fn()
}))
vi.mock('@/services/httpService', () => ({
  getUrlFromEndpoint: vi.fn((path: string) => `http://testurl.com/${path}`)
}))
vi.mock('@/stores/UserStore', () => ({
  useUserStore: () => ({
    isAuthenticated: () => true
  })
}))

const mockItem = {
  id: '123',
  title: 'Test Item',
  price: 100,
  imagePath: '/images/test.jpg',
  briefDescription: 'Kort beskrivelse',
  isFavorited: false
}

const router = createRouter({
  history: createWebHistory(),
  routes: []
})

describe('ItemCardMinimized.vue', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('renders item data correctly', () => {
    const wrapper = mount(ItemCardMinimized, {
      props: { item: mockItem },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    expect(wrapper.text()).toContain(mockItem.title)
    expect(wrapper.text()).toContain('100 kr')
    expect(wrapper.text()).toContain(mockItem.briefDescription)

    const img = wrapper.find('img.item-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('http://testurl.com/images/test.jpg')
  })

  it('renders favorite button only if logged in and isFavoriteable', () => {
    const wrapper = mount(ItemCardMinimized, {
      props: {
        item: mockItem,
        isFavoriteable: true
      },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    const heartBtn = wrapper.find('button.favorite-btn')
    expect(heartBtn.exists()).toBe(true)
  })

  it('does not render favorite button if not favoriteable', () => {
    const wrapper = mount(ItemCardMinimized, {
      props: {
        item: mockItem,
        isFavoriteable: false
      },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    const heartBtn = wrapper.find('button.favorite-btn')
    expect(heartBtn.exists()).toBe(false)
  })

  it('calls toggleFavorite when heart button is clicked', async () => {
    (toggleFavorite as any).mockResolvedValue(true)

    const wrapper = mount(ItemCardMinimized, {
      props: { item: mockItem },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    const button = wrapper.find('button.favorite-btn')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(toggleFavorite).toHaveBeenCalledWith('123')
  })

  it('displays fallback image if imagePath is empty', () => {
    const item = { ...mockItem, imagePath: '' }
    const wrapper = mount(ItemCardMinimized, {
      props: { item },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/default-image.png')
  })

  it('router-link has correct path and query', () => {
    const wrapper = mount(ItemCardMinimized, {
      props: { item: mockItem, routePath: '/custom-path' },
      global: {
        plugins: [createTestingPinia(), router]
      }
    })

    const link = wrapper.find('a.no-link-style')
    expect(link.attributes('href')).toContain('/custom-path?id=123')
  })
})