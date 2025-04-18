import { describe, it, expect, beforeEach, vi } from 'vitest'
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
            createSpy: vi.fn,
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

    expect(wrapper.text()).toContain('Logg inn')
    expect(wrapper.text()).not.toContain('Logg ut')
  })

  // Can be implemented when the actual NavBar has the Log out button in the right state
  // it('shows Log out when user IS logged in', () => {
  //   const wrapper = mount(Navbar, {
  //     global: {
  //       plugins: [
  //         createTestingPinia({
  //           createSpy: vi.fn,
  //           initialState: {
  //             UserStore: {
  //               isAuthenticated: true,
  //             },
  //           },
  //         }),
  //         router,
  //       ],
  //     },
  //   })

  //   expect(wrapper.text()).toContain('Log out')
  //   expect(wrapper.text()).not.toContain('Login')
  // })
})
