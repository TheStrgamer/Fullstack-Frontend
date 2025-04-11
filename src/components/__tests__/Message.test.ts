import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessage from '@/components/chat/Message.vue'

describe('ChatMessage.vue', () => {
  const baseProps = {
    user: { sentByMe: false },
    message: 'Hello world',
    timestamp: '11:30',
    avatar: '/img.png',
    name: 'Alice'
  }

  it('renders name, message, and timestamp', () => {
    const wrapper = mount(ChatMessage, {
      props: baseProps
    })

    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Hello world')
    expect(wrapper.text()).toContain('11:30')
  })

  it('adds "sent-by-me" class if user.sentByMe is true', () => {
    const wrapper = mount(ChatMessage, {
      props: {
        ...baseProps,
        user: { sentByMe: true }
      }
    })

    expect(wrapper.classes()).toContain('sent-by-me')
  })

  it('does not add "sent-by-me" class if sentByMe is false', () => {
    const wrapper = mount(ChatMessage, {
      props: {
        ...baseProps,
        user: { sentByMe: false }
      }
    })

    expect(wrapper.classes()).not.toContain('sent-by-me')
  })

  it('shows custom avatar if avatar prop is provided', () => {
    const wrapper = mount(ChatMessage, {
      props: baseProps
    })

    const img = wrapper.find('img.avatar')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/img.png')
  })

  it('shows default avatar if avatar is empty', () => {
    const wrapper = mount(ChatMessage, {
      props: {
        ...baseProps,
        avatar: ''
      }
    })

    const img = wrapper.find('img.avatar')
    expect(img.attributes('src')).toContain('https://encrypted-tbn0.gstatic.com/images?q=tbn:')
  })
})
