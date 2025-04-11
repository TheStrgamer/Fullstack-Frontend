import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemComponentMaximized from '@/components/ItemComponentMaximized.vue'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'

// ✅ Mock route to return a query param
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: () => ({
      query: { id: '123' }
    })
  }
})

// ✅ Mock router.push
vi.mock('@/router', () => ({
  default: { push: vi.fn() }
}))

// ✅ Mock stores
vi.mock('@/stores/UserStore', () => ({
  useUserStore: () => ({
    isAuthenticated: () => true
  })
}))

// ✅ Mock services
vi.mock('@/services/favoriteService', () => ({
  toggleFavorite: vi.fn(),
  checkFavoriteStatus: vi.fn()
}))

vi.mock('@/services/chatService', () => ({
  startConversation: vi.fn().mockResolvedValue(42)
}))

vi.mock('@/services/httpService', () => ({
  getUrlFromEndpoint: vi.fn((path: string) => `http://mocked/${path}`)
}))

// ✅ Mock child components
vi.mock('@/components/ContactInfoComponent.vue', () => ({
  default: { template: '<div>MockContactInfo</div>' }
}))

vi.mock('@/components/PositionElementsComponent.vue', () => ({
  default: { template: '<div>MockPosition</div>' }
}))

// ✅ Mock item store
const mockItemStore = {
  title: 'Mock Title',
  price: 200,
  sale_status: 0,
  categoryName: 'Møbler',
  conditionName: 'Ny',
  size: 'M',
  full_description: 'Lang beskrivelse',
  latitude: 59.9,
  longitude: 10.7,
  creatorId: 1,
  created_at: '2024-03-01',
  updated_at: '2024-04-01',
  imageUrls: ['/image1.jpg', '/image2.jpg'],
  fetchItem: vi.fn()
}

vi.mock('@/stores/ItemStore.ts', () => ({
  useItemStore: () => mockItemStore
}))

import { toggleFavorite, checkFavoriteStatus } from '@/services/favoriteService'
import router from '@/router'

describe('ItemComponentMaximized.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading spinner when itemLoaded is false', () => {
    const wrapper = mount(ItemComponentMaximized, {
      global: { plugins: [createTestingPinia()] }
    })

    expect(wrapper.text()).toContain('Laster inn produkt...')
  })

  it('calls fetchItem and checkFavoriteStatus on mount', async () => {
    (checkFavoriteStatus as any).mockResolvedValue(true)

    mount(ItemComponentMaximized, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    expect(mockItemStore.fetchItem).toHaveBeenCalledWith('123')
    expect(checkFavoriteStatus).toHaveBeenCalledWith(123)
  })

  it('toggles favorite status on heart click', async () => {
    const wrapper = mount(ItemComponentMaximized, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    const heartButton = wrapper.find('button.favorite-btn')
    expect(heartButton.exists()).toBe(true)

    await heartButton.trigger('click')
    expect(toggleFavorite).toHaveBeenCalledWith(123)
  })

  it('navigates to next and previous image in carousel', async () => {
    const wrapper = mount(ItemComponentMaximized, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    const nextBtn = wrapper.find('button.right')
    const prevBtn = wrapper.find('button.left')
    const image = () => wrapper.find('img.item-image')

    expect(image().attributes('src')).toContain('/image1')

    await nextBtn.trigger('click')
    expect(image().attributes('src')).toContain('/image2')

    await prevBtn.trigger('click')
    expect(image().attributes('src')).toContain('/image1')
  })

  it('formats date correctly', async () => {
    const wrapper = mount(ItemComponentMaximized, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('1. mars 2024')
    expect(wrapper.text()).toContain('1. april 2024')
  })

  it('starts conversation and redirects to chat', async () => {
    const wrapper = mount(ItemComponentMaximized, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    const btn = wrapper.find('button.negotiate-button')
    await btn.trigger('click')

    expect(router.push).toHaveBeenCalledWith({
        name: 'chat',
        params: { chatId: 42 }
      })
  })
})