import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatListItem from '@/components/chat/ChatListItem.vue'

vi.mock('@/services/httpService', () => ({
  getUrlFromEndpoint: (path: string) => `/mocked/${path}`
}))

describe('ChatListItem.vue', () => {
  const user = {
    id: 1,
    name: 'Alice',
    avatar: '/alice.png'
  }

  it('renders user name, message, and timestamp', () => {
    const wrapper = mount(ChatListItem, {
      props: {
        user,
        lastMessage: 'Hello!',
        timestamp: '10:30'
      }
    })

    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Hello!')
    expect(wrapper.text()).toContain('10:30')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(ChatListItem, {
      props: {
        user,
        lastMessage: 'Hi',
        timestamp: '10:00'
      }
    })

    await wrapper.find('.chat-list-item-content').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('uses getUrlFromEndpoint when avatar is present', () => {
    const wrapper = mount(ChatListItem, {
      props: {
        user,
        lastMessage: '',
        timestamp: ''
      }
    })

    const img = wrapper.find('img.avatar')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/mocked/alice.png')
  })

  it('shows default avatar when avatar is empty string', () => {
    const wrapper = mount(ChatListItem, {
      props: {
        user: { ...user, avatar: '' },
        lastMessage: '',
        timestamp: ''
      }
    })

    const img = wrapper.find('img.avatar')
    expect(img.attributes('src')).toContain('https://encrypted-tbn0.gstatic.com/images?q=tbn:')
  })
})
