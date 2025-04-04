import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import Navbar from '../NavbarComponent.vue'

let router: ReturnType<typeof createRouter>

beforeEach(() => {
  router = createRouter({
    history: createMemoryHistory(),
    routes: [],
  })
})

describe('Navbar', () => {
  it('shows Login when user is NOT logged in', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              UserStore: {
                isAuthenticated: false,
              },
            },
          }),
          router,
        ],
      },
    })

    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).not.toContain('Log out')
  })

  it('shows Log out when user IS logged in', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              UserStore: {
                isAuthenticated: true,
              },
            },
          }),
          router,
        ],
      },
    })

    expect(wrapper.text()).toContain('Log out')
    expect(wrapper.text()).not.toContain('Login')
  })
})
