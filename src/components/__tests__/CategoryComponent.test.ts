import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryComponent from '@/components/CategoryComponent.vue'
import { getAllCategoryNames } from '@/services/httpService'
import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

// Mock the category service
vi.mock('@/services/httpService', () => ({
  getAllCategoryNames: vi.fn()
}))

const mockCategories = ['Elektronikk', 'Møbler', 'Sport']

// Fixed the routes configuration to match the `RouteRecordRaw` type
const routes = [
  {
    path: '/category/:categoryName',
    name: 'CategoryListings',
    component: { template: '<div>Mock Category Listings</div>' },
  },
];

describe('CategoryComponent.vue', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    // Reset mocks and create a mock router
    vi.resetAllMocks()
    ;(getAllCategoryNames as any).mockResolvedValue(mockCategories)

    router = createRouter({
      history: createWebHistory(),
      routes
    })
  })
  afterEach(() => {
    window.innerWidth = 1024 // or whatever your usual test size is
    vi.restoreAllMocks()
  })

  it('fetches and renders categories on mount', async () => {
    const wrapper = mount(CategoryComponent, {
      global: {
        plugins: [router]
      }
    })

    // Wait for async data and rendering
    await nextTick()
    await nextTick()

    expect(getAllCategoryNames).toHaveBeenCalled()
    const categoryItems = wrapper.findAll('li')
    expect(categoryItems.length).toBe(mockCategories.length)
    expect(categoryItems[0].text()).toBe('Elektronikk')
  })

  it('toggles menu on button click', async () => {
    // Set window width to small before mounting
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))
  
    const wrapper = mount(CategoryComponent, {
      global: { plugins: [router] }
    })
  
    await nextTick()
  
    const button = wrapper.find('button.category-toggle')
    expect(wrapper.find('ul').exists()).toBe(false)
  
    await button.trigger('click')
    expect(wrapper.find('ul').exists()).toBe(true)
  
    await button.trigger('click')
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('navigates when a category is selected', async () => {
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mount(CategoryComponent, {
      global: {
        plugins: [router]
      }
    })

    await router.isReady()
    await nextTick()
    await nextTick()

    const firstCategory = wrapper.findAll('li')[0]
    await firstCategory.trigger('click')

    expect(pushSpy).toHaveBeenCalledWith({
      name: 'CategoryListings',
      params: { categoryName: 'Elektronikk' }
    })
  })

  it('updates isWideScreen on resize', async () => {
    const wrapper = mount(CategoryComponent, {
      global: { plugins: [router] }
    })

    ;(window.innerWidth as number) = 800
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    // Check internal state
    const isWideScreen = (wrapper.vm as any).isWideScreen
    expect(isWideScreen).toBe(true)

    ;(window.innerWidth as number) = 600
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect((wrapper.vm as any).isWideScreen).toBe(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})
