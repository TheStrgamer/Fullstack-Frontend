import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterComponent from '@/components/RegisterComponent.vue'
import flushPromises from 'flush-promises'
import { postDataWithoutAuth } from '@/services/httpService'
import router from '@/router'
import axios from 'axios'

vi.mock('@/services/httpService', () => ({
  postDataWithoutAuth: vi.fn()
}))

vi.mock('@/router', () => ({
  default: { push: vi.fn() }
}))

describe('RegisterComponent.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all fields and submit button', () => {
    const wrapper = mount(RegisterComponent)
    expect(wrapper.find('input#firstName').exists()).toBe(true)
    expect(wrapper.find('input#lastName').exists()).toBe(true)
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#phonenumber').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('input#passwordConfirm').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows validation errors for empty fields', async () => {
    const wrapper = mount(RegisterComponent)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('First name cannot be empty')
    expect(wrapper.text()).toContain('Last name cannot be empty')
    expect(wrapper.text()).toContain('Please enter a valid email')
    expect(wrapper.text()).toContain('Phone number must be 8 digits')
    expect(wrapper.text()).toContain('Password must be at least 3 characters')
  })

  it('shows password mismatch error', async () => {
    const wrapper = mount(RegisterComponent)
    await wrapper.find('input#firstName').setValue('Anna')
    await wrapper.find('input#lastName').setValue('Test')
    await wrapper.find('input#email').setValue('anna@example.com')
    await wrapper.find('input#phonenumber').setValue('12345678')
    await wrapper.find('input#password').setValue('abc123')
    await wrapper.find('input#passwordConfirm').setValue('different')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('calls postDataWithoutAuth and redirects on success', async () => {
    ;(postDataWithoutAuth as any).mockResolvedValue({ status: 200 })
  
    const mockRouter = { push: vi.fn() }
  
    const wrapper = mount(RegisterComponent, {
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })
  
    await wrapper.find('input#firstName').setValue('Anna')
    await wrapper.find('input#lastName').setValue('Test')
    await wrapper.find('input#email').setValue('anna@example.com')
    await wrapper.find('input#phonenumber').setValue('12345678')
    await wrapper.find('input#password').setValue('abc123')
    await wrapper.find('input#passwordConfirm').setValue('abc123')
  
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
  
    expect(postDataWithoutAuth).toHaveBeenCalledWith('users/register', {
      firstname: 'Anna',
      surname: 'Test',
      email: 'anna@example.com',
      password: 'abc123',
      phonenumber: '12345678'
    })
  
    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })
  

  it('shows email conflict error on 409', async () => {
    ;(postDataWithoutAuth as any).mockRejectedValue({
      isAxiosError: true,
      response: { status: 409, data: 'Email is already in use' }
    })

    const wrapper = mount(RegisterComponent)

    await wrapper.find('input#firstName').setValue('Anna')
    await wrapper.find('input#lastName').setValue('Test')
    await wrapper.find('input#email').setValue('anna@example.com')
    await wrapper.find('input#phonenumber').setValue('12345678')
    await wrapper.find('input#password').setValue('abc123')
    await wrapper.find('input#passwordConfirm').setValue('abc123')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Email is already in use')
  })

  it('shows phone conflict error on 409', async () => {
    ;(postDataWithoutAuth as any).mockRejectedValue({
      isAxiosError: true,
      response: { status: 409, data: 'Phone number is already in use' }
    })

    const wrapper = mount(RegisterComponent)

    await wrapper.find('input#firstName').setValue('Anna')
    await wrapper.find('input#lastName').setValue('Test')
    await wrapper.find('input#email').setValue('anna@example.com')
    await wrapper.find('input#phonenumber').setValue('12345678')
    await wrapper.find('input#password').setValue('abc123')
    await wrapper.find('input#passwordConfirm').setValue('abc123')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Phone number is already in use')
  })

  it('shows fallback error on unknown 409 conflict', async () => {
    ;(postDataWithoutAuth as any).mockRejectedValue({
      isAxiosError: true,
      response: { status: 409, data: 'Some other conflict' }
    })

    const wrapper = mount(RegisterComponent)
    await wrapper.find('input#firstName').setValue('Anna')
    await wrapper.find('input#lastName').setValue('Test')
    await wrapper.find('input#email').setValue('anna@example.com')
    await wrapper.find('input#phonenumber').setValue('12345678')
    await wrapper.find('input#password').setValue('abc123')
    await wrapper.find('input#passwordConfirm').setValue('abc123')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Conflict error occurred')
  })

  it('shows network error message', async () => {
    ;(postDataWithoutAuth as any).mockRejectedValue({
      isAxiosError: true,
      request: {}
    })

    const wrapper = mount(RegisterComponent)
    await wrapper.find('input#firstName').setValue('Anna')
    await wrapper.find('input#lastName').setValue('Test')
    await wrapper.find('input#email').setValue('anna@example.com')
    await wrapper.find('input#phonenumber').setValue('12345678')
    await wrapper.find('input#password').setValue('abc123')
    await wrapper.find('input#passwordConfirm').setValue('abc123')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('No response from the server')
  })

  it('shows fallback error on unknown failure', async () => {
    ;(postDataWithoutAuth as any).mockRejectedValue({
      isAxiosError: false,
      message: 'something strange happened'
    })

    const wrapper = mount(RegisterComponent)
    await wrapper.find('input#firstName').setValue('Anna')
    await wrapper.find('input#lastName').setValue('Test')
    await wrapper.find('input#email').setValue('anna@example.com')
    await wrapper.find('input#phonenumber').setValue('12345678')
    await wrapper.find('input#password').setValue('abc123')
    await wrapper.find('input#passwordConfirm').setValue('abc123')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('An unexpected error occurred')
  })
})