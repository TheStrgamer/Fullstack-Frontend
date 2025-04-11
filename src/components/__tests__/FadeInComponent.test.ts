import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FadeInComponent from '@/components/FadeInComponent.vue'

describe('FadeInComponent.vue', () => {
  let observeMock: any
  let unobserveMock: any

  beforeEach(() => {
    // Mock IntersectionObserver
    unobserveMock = vi.fn()
    observeMock = vi.fn((el: Element) => {
      // Simulate intersection after observing
      setTimeout(() => {
        (el as any).__callback__([{ isIntersecting: true, target: el }])
      }, 0)
    })

    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: any) {
        return {
          observe: (el: Element) => {
            (el as any).__callback__ = callback
            observeMock(el)
          },
          unobserve: unobserveMock
        }
      }
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders slot content', () => {
    const wrapper = mount(FadeInComponent, {
      slots: {
        default: '<p>Fade me in</p>'
      }
    })

    expect(wrapper.text()).toContain('Fade me in')
  })

  it('applies correct direction class', () => {
    const wrapper = mount(FadeInComponent, {
      props: {
        direction: 'left'
      }
    })

    expect(wrapper.classes()).toContain('from-left')
  })

  it('applies visible class when intersecting', async () => {
    const wrapper = mount(FadeInComponent)
    
    // Wait for the mock observer to simulate visibility
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(wrapper.classes()).toContain('visible')
    expect(unobserveMock).toHaveBeenCalled()
  })

  it('applies transition duration from prop', () => {
    const wrapper = mount(FadeInComponent, {
      props: {
        duration: 1234
      }
    })

    expect(wrapper.attributes('style')).toContain('transition-duration: 1234ms')
  })
})
