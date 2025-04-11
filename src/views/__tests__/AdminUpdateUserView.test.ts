import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AdminUpdateUserView from '@/views/AdminUpdateUserView.vue'
import { fetchDataWithAuth, putDataWithAuth } from '@/services/httpService'

vi.mock('@/services/httpService', () => ({
  fetchDataWithAuth: vi.fn(),
  putDataWithAuth: vi.fn()
}))

vi.mock('@/components/admin/AdminHeaderComponent.vue', () => ({
  default: { template: '<div>Header</div>' }
}))

const goSpy = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({ go: goSpy })
  }
})

const mockUser = {
  firstname: 'John',
  surname: 'Doe',
  email: 'john@example.com',
  phonenumber: '12345678',
  role: 'ADMIN'
}

describe('AdminUpdateUserView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading initially', () => {
    const wrapper = mount(AdminUpdateUserView, {
      props: { userId: 1 }
    })
    expect(wrapper.text()).toContain('Loading user data...')
  })

  it('fetches and shows form with user data', async () => {
    (fetchDataWithAuth as any).mockResolvedValue({ data: mockUser })

    const wrapper = mount(AdminUpdateUserView, {
      props: { userId: 1 }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Edit User')
  })

  it('shows error message if update fails', async () => {
    (fetchDataWithAuth as any).mockResolvedValue({ data: mockUser })
    ;(putDataWithAuth as any).mockRejectedValue({ response: { data: 'Update failed' } })

    const wrapper = mount(AdminUpdateUserView, {
      props: { userId: 1 },
      global: {
        stubs: {
          InputFormComponent: {
            props: ['fields'],
            emits: ['submit'],
            template: `
              <form @submit.prevent="$emit('submit', {
                firstname: 'John',
                surname: 'Doe',
                email: 'john@example.com',
                phonenumber: '00000000',
                isAdmin: true
              })">
                <button>Submit</button>
              </form>
            `
          }
        }
      }
    })

    await flushPromises()
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Update failed')
  })
})