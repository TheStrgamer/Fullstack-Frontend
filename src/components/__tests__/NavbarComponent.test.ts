import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

vi.mock('@/stores/UserStore', () => ({
  useUserStore: () => ({
    isAuthenticated: () => false,
    isUserAdmin: () => false
  })
}))

describe('Navbar.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders logos', async () => {
    const { default: Navbar } = await import('@/components/NavbarComponent.vue')
    const wrapper = mount(Navbar, {
      global: { plugins: [createTestingPinia()] }
    })

    expect(wrapper.find('img.logo-icon').exists()).toBe(true)
    expect(wrapper.find('img.logo-text').exists()).toBe(true)
  })

  it('shows Login when not logged in', async () => {
    vi.resetModules()
    vi.doMock('@/stores/UserStore', () => ({
      useUserStore: () => ({
        isAuthenticated: () => false,
        isUserAdmin: () => false
      })
    }))
    const { default: Navbar } = await import('@/components/NavbarComponent.vue')

    const wrapper = mount(Navbar, {
      global: { plugins: [createTestingPinia()] }
    })

    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).not.toContain('Log out')
  })

  it('shows Log out when logged in', async () => {
    vi.resetModules()
    vi.doMock('@/stores/UserStore', () => ({
      useUserStore: () => ({
        isAuthenticated: () => true,
        isUserAdmin: () => false
      })
    }))
    const { default: Navbar } = await import('@/components/NavbarComponent.vue')

    const wrapper = mount(Navbar, {
      global: { plugins: [createTestingPinia()] }
    })

    expect(wrapper.text()).toContain('Log out')
    expect(wrapper.text()).not.toContain('Login')
  })

  it('shows admin link when isAdmin is true', async () => {
    vi.resetModules()
    vi.doMock('@/stores/UserStore', () => ({
      useUserStore: () => ({
        isAuthenticated: () => true,
        isUserAdmin: () => true
      })
    }))
    const { default: Navbar } = await import('@/components/NavbarComponent.vue')

    const wrapper = mount(Navbar, {
      global: { plugins: [createTestingPinia()] }
    })

    expect(wrapper.text()).toContain('Admin')
  })

  it('toggles menu class when hamburger clicked', async () => {
    const { default: Navbar } = await import('@/components/NavbarComponent.vue')
    const wrapper = mount(Navbar, {
      global: { plugins: [createTestingPinia()] }
    })

    const header = wrapper.find('header')
    const button = wrapper.find('button.menu-toggle')

    expect(header.classes()).not.toContain('open')

    await button.trigger('click')
    expect(header.classes()).toContain('open')

    await button.trigger('click')
    expect(header.classes()).not.toContain('open')
  })

  it('closes mobile menu when link is clicked', async () => {
    vi.resetModules()
    vi.doMock('@/stores/UserStore', () => ({
      useUserStore: () => ({
        isAuthenticated: () => true,
        isUserAdmin: () => false
      })
    }))
    const { default: Navbar } = await import('@/components/NavbarComponent.vue')
  
    const wrapper = mount(Navbar, {
      global: {
        plugins: [createTestingPinia()],
        stubs: ['router-link']
      }
    })
  
    await wrapper.find('button.menu-toggle').trigger('click')
  
    const links = wrapper.findAll('router-link-stub')
    const profileLink = links.find(link => link.attributes('to') === '/profile')
    expect(profileLink).toBeTruthy()
  
    await profileLink!.trigger('click')
  
    expect(wrapper.find('header').classes()).not.toContain('open')
  })
  
})

