import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AdminUpdateCategoryView from '@/views/AdminUpdateCategoryView.vue'
import { fetchDataWithAuth, putDataWithAuth } from '@/services/httpService'

// Mocks
vi.mock('@/services/httpService', () => ({
  fetchDataWithAuth: vi.fn(),
  putDataWithAuth: vi.fn()
}))

vi.mock('@/components/admin/AdminHeaderComponent.vue', () => ({
  default: {
    template: '<div class="mock-header">Header</div>'
  }
}))

// Properly mock useRouter with spy
const goSpy = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({ go: goSpy })
  }
})

// Update InputFormComponent to render headerText
vi.mock('@/components/admin/InputFormComponent.vue', () => ({
  default: {
    props: ['fields', 'headerText'],
    emits: ['submit'],
    template: `
      <div>
        <h1>{{ headerText }}</h1>
        <form @submit.prevent="$emit('submit', { name: 'Updated Name', description: 'Updated Description' })">
          <button type="submit">Submit</button>
        </form>
      </div>
    `
  }
}))

const mockCategory = {
  id: 1,
  name: 'Original Name',
  description: 'Original Description'
}

describe('AdminUpdateCategoryView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading message before data is loaded', () => {
    const wrapper = mount(AdminUpdateCategoryView, {
      props: { categoryId: 1 }
    })

    expect(wrapper.text()).toContain('Loading category data...')
  })

  it('fetches category data and displays form', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({ data: mockCategory })

    const wrapper = mount(AdminUpdateCategoryView, {
      props: { categoryId: 1 }
    })

    await flushPromises()

    expect(wrapper.text()).not.toContain('Loading category data...')
    expect(wrapper.text()).toContain('Edit category')
  })

  it('submits updated category and navigates back', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({ data: mockCategory })
    ;(putDataWithAuth as any).mockResolvedValue({ data: true })

    const wrapper = mount(AdminUpdateCategoryView, {
      props: { categoryId: 1 }
    })

    await flushPromises()
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(putDataWithAuth).toHaveBeenCalledWith('admin/categories/update/1', {
      name: 'Updated Name',
      description: 'Updated Description'
    })
    expect(goSpy).toHaveBeenCalledWith(-1)
  })

  it('shows "no changes made" feedback if fields unchanged', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({ data: mockCategory })

    const wrapper = mount(AdminUpdateCategoryView, {
      props: { categoryId: 1 },
      global: {
        stubs: {
          InputFormComponent: {
            props: ['fields'],
            emits: ['submit'],
            template: `
              <form @submit.prevent="$emit('submit', { name: 'Original Name', description: 'Original Description' })">
                <button type="submit">Submit</button>
              </form>
            `
          }
        }
      }
    })

    await flushPromises()
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('No changes made.')
  })

  it('shows error feedback if update fails', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({ data: mockCategory })
    ;(putDataWithAuth as any).mockRejectedValue({ response: { data: 'Update failed' } })

    const wrapper = mount(AdminUpdateCategoryView, {
      props: { categoryId: 1 }
    })

    await flushPromises()
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Update failed')
  })
})