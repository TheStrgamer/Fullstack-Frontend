import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AdminCreateCategoryView from '@/views/AdminCreateCategoryView.vue'

import { fetchDataWithAuth, postDataWithAuth } from '@/services/httpService'

vi.mock('@/services/httpService', () => ({
  fetchDataWithAuth: vi.fn(),
  postDataWithAuth: vi.fn()
}))

vi.mock('@/components/admin/AdminHeaderComponent.vue', () => ({
  default: { template: '<div class="mock-header">Admin Header</div>' }
}))

vi.mock('@/components/admin/InputFormComponent.vue', () => ({
  default: {
    props: ['headerText', 'fields'],
    emits: ['submit'],
    template: `
      <form @submit.prevent="$emit('submit', { name: 'Books', description: 'All books' })">
        <button type="submit">Submit</button>
      </form>
    `
  }
}))

const mockCategories = [
  { id: 1, name: 'Electronics', description: 'Phones, Laptops' },
  { id: 2, name: 'Furniture', description: 'Tables, Chairs' }
]

describe('AdminCreateCategoryView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches and renders category list', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({ data: mockCategories })

    const wrapper = mount(AdminCreateCategoryView)
    await flushPromises()

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(wrapper.text()).toContain('Electronics')
    expect(wrapper.text()).toContain('Furniture')
  })

  it('submits new category if not duplicate', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({ data: [] })
    ;(postDataWithAuth as any).mockResolvedValue({ data: true })

    const reloadSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({ reload: vi.fn() } as any)

    const wrapper = mount(AdminCreateCategoryView)
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(postDataWithAuth).toHaveBeenCalledWith('admin/categories/add', {
      name: 'Books',
      description: 'All books'
    })
  })

  it('shows feedback and does not submit if duplicate name', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({
      data: [{ id: 1, name: 'Books', description: 'Something' }]
    })

    const wrapper = mount(AdminCreateCategoryView)
    await flushPromises()

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Category with this name already exists.')
    expect(postDataWithAuth).not.toHaveBeenCalled()
  })

  it('does not submit if name or description is missing', async () => {
    ;(fetchDataWithAuth as any).mockResolvedValue({ data: [] })

    // Replace the stub with an "empty submission"
    vi.mocked(postDataWithAuth).mockClear()

    const wrapper = mount(AdminCreateCategoryView, {
      global: {
        stubs: {
          InputFormComponent: {
            props: ['headerText', 'fields'],
            emits: ['submit'],
            template: `
              <form @submit.prevent="$emit('submit', { name: '', description: '' })">
                <button type="submit">Submit</button>
              </form>
            `
          }
        }
      }
    })

    await flushPromises()
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(postDataWithAuth).not.toHaveBeenCalled()
  })
})
