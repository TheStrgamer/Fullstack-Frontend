import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginComponent from '@/components/LoginComponent.vue'
import { createTestingPinia } from '@pinia/testing'
import flushPromises from 'flush-promises'
import router from '@/router'
import axios from 'axios'

// Mock user store
const mockGetToken = vi.fn()

vi.mock('@/stores/UserStore', () => ({
  useUserStore: () => ({
    getTokenAndSaveInStore: mockGetToken,
    jwtToken: 'mocked-token'
  })
}))

// Mock router
vi.mock('@/router', () => ({
  default: { push: vi.fn() }
}))

describe('LoginComponent.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    const wrapper = mount(LoginComponent)
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Logg inn')
  })

  it('shows error for invalid email', async () => {
    const wrapper = mount(LoginComponent)

    await wrapper.find('input#email').setValue('bad-email')
    await wrapper.find('input#password').setValue('validpass')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Please enter a valid email')
  })

  it('shows error for short password', async () => {
    const wrapper = mount(LoginComponent)

    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('12')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Password must be at least 3 characters')
  })

  it('calls login and redirects on success', async () => {
    mockGetToken.mockResolvedValue(undefined)

    const wrapper = mount(LoginComponent)
    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockGetToken).toHaveBeenCalledWith('test@example.com', '123456')
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('handles 400 error', async () => {
    mockGetToken.mockRejectedValue({
      isAxiosError: true,
      response: { status: 400 }
    })

    const wrapper = mount(LoginComponent)
    await wrapper.find('input#email').setValue('fail@example.com')
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Please enter a valid email and password.')
  })

  it('handles 401 error', async () => {
    mockGetToken.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 }
    })

    const wrapper = mount(LoginComponent)
    await wrapper.find('input#email').setValue('test@example.com')
    await wrapper.find('input#password').setValue('wrongpass')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Incorrect password')
  })

  it('handles 404 error', async () => {
    mockGetToken.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 }
    })

    const wrapper = mount(LoginComponent)
    await wrapper.find('input#email').setValue('nouser@example.com')
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('No user with given email')
  })

  it('handles network/unknown error', async () => {
    mockGetToken.mockRejectedValue({
      isAxiosError: true,
      response: undefined
    })

    const wrapper = mount(LoginComponent)
    await wrapper.find('input#email').setValue('net@example.com')
    await wrapper.find('input#password').setValue('123456')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Network error')
  })
})