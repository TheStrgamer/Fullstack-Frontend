import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Navbar from '../NavbarComponent.vue'

describe('Navbar', () => {
  it('renders properly', () => {
    const wrapper = mount(Navbar)
    expect(wrapper.text()).toContain('Home')
  })
})