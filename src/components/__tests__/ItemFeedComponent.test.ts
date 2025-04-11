import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemFeedComponent from '@/components/ItemFeedComponent.vue'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'

// Base mock array
const baseItems = Array.from({ length: 13 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`
}))

let mockItems = [...baseItems] // mutable version per test

vi.mock('@/stores/FeedStore.ts', () => {
  return {
    useFeedStore: () => ({
      fetchRecommendedItems: vi.fn(),
      get getRecommendedItems() {
        return mockItems
      }
    })
  }
})

vi.mock('@/components/ItemCardMinimized.vue', () => ({
  default: {
    props: ['item'],
    template: '<div class="mock-card">{{ item.title }}</div>'
  }
}))

vi.mock('@/components/FadeInComponent.vue', () => ({
  default: {
    props: ['duration', 'direction'],
    template: '<div class="mock-fade"><slot /></div>'
  }
}))

describe('ItemFeedComponent.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockItems = [...baseItems] // reset for each test
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('displays fallback message when feed is empty', async () => {
    mockItems = []

    const wrapper = mount(ItemFeedComponent, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Ingen annonser å vise')
  })

  it('renders correct number of paginated items (desktop)', async () => {
    window.innerWidth = 800
    window.dispatchEvent(new Event('resize'))

    const wrapper = mount(ItemFeedComponent, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    const cards = wrapper.findAll('.mock-card')

    expect(cards.length).toBe(12)
    expect(wrapper.text()).toContain('Side 1 av 2')
  })

  it('navigates to next and previous page', async () => {
    window.innerWidth = 800
    window.dispatchEvent(new Event('resize'))

    const wrapper = mount(ItemFeedComponent, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    const buttons = wrapper.findAll('button')
    const prevBtn = buttons.find(b => b.text() === 'Forrige')!
    const nextBtn = buttons.find(b => b.text() === 'Neste')!

    expect(prevBtn.attributes('disabled')).toBeDefined()

    await nextBtn.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Side 2 av 2')

    await prevBtn.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Side 1 av 2')
  })

  it('sets itemsPerPage to 5 on small screens', async () => {
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))

    const wrapper = mount(ItemFeedComponent, {
      global: {
        plugins: [createTestingPinia()]
      }
    })

    await flushPromises()

    const cards = wrapper.findAll('.mock-card')
    expect(cards.length).toBe(5)
  })
})
