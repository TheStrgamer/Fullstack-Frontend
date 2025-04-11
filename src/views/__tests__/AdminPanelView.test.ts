import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory, RouterView } from 'vue-router'
import AdminPanelView from '@/views/AdminPanelView.vue'

vi.mock('@/components/admin/AdminHeaderComponent.vue', () => ({
  default: {
    template: '<div class="mock-header">Header</div>'
  }
}))

vi.mock('@/components/admin/AdminSidebarComponent.vue', () => ({
  default: {
    template: '<div class="mock-sidebar">Sidebar</div>'
  }
}))

const DummyComponent = {
  template: '<div class="dummy-child">Dynamic Admin Child</div>'
}

describe('AdminPanelView.vue', () => {
  it('renders header and sidebar', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: DummyComponent }
      ]
    })

    router.push('/')
    await router.isReady()

    const wrapper = mount(AdminPanelView, {
      global: {
        plugins: [router],
        stubs: { RouterView }
      }
    })

    expect(wrapper.find('.mock-header').exists()).toBe(true)
    expect(wrapper.find('.mock-sidebar').exists()).toBe(true)
  })

  it('renders dynamic content from router-view inside keep-alive', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: DummyComponent }
      ]
    })

    router.push('/')
    await router.isReady()

    const wrapper = mount(AdminPanelView, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.dummy-child').exists()).toBe(true)

    const keepAlive = wrapper.findComponent({ name: 'KeepAlive' })
    expect(keepAlive.exists()).toBe(true)
  })
})
