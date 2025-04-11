import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomButton from '@/components/CustomButton.vue'

describe('CustomButton.vue', () => {
  it('renders title text', () => {
    const wrapper = mount(CustomButton, {
      props: {
        title: 'Click me',
        icon_path: ''
      }
    })

    expect(wrapper.text()).toContain('Click me')
  })

  it('renders icon if icon_path is provided', () => {
    const wrapper = mount(CustomButton, {
      props: {
        title: 'Download',
        icon_path: '/icons/download.svg'
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/icons/download.svg')
  })

  it('does not render icon if icon_path is empty', () => {
    const wrapper = mount(CustomButton, {
      props: {
        title: 'No Icon',
        icon_path: ''
      }
    })

    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('emits "clicked" when button is clicked', async () => {
    const wrapper = mount(CustomButton, {
      props: {
        title: 'Submit',
        icon_path: ''
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('clicked')
    expect(wrapper.emitted('clicked')?.length).toBe(1)
  })
})
