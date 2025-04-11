import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatListComponent from '@/components/chat/ChatListComponent.vue'

// Stub ChatListItem
vi.mock('@/components/chat/ChatListItem.vue', () => ({
  default: {
    props: ['user', 'lastMessage', 'timestamp'],
    template: `<div class="chat-list-item" @click="$emit('click')">{{ user.name }}</div>`
  }
}))

describe('ChatListComponent.vue', () => {
  const mockChats = [
    {
      id: 1,
      name: 'Alice',
      avatar: '/alice.png',
      lastMessage: 'Hi',
      timestamp: '10:00'
    },
    {
      id: 2,
      name: 'Bob',
      avatar: '/bob.png',
      lastMessage: 'Hey there',
      timestamp: '10:10'
    }
  ]

  it('renders a list of chats', () => {
    const wrapper = mount(ChatListComponent, {
      props: {
        chats: mockChats
      }
    })

    const items = wrapper.findAll('.chat-list-item')
    expect(items.length).toBe(2)
    expect(items[0].text()).toContain('Alice')
    expect(items[1].text()).toContain('Bob')
  })

  it('emits clicked with chat ID when item is clicked', async () => {
    const wrapper = mount(ChatListComponent, {
      props: {
        chats: mockChats
      }
    })

    const items = wrapper.findAll('.chat-list-item')
    await items[1].trigger('click')

    expect(wrapper.emitted('clicked')).toBeTruthy()
    expect(wrapper.emitted('clicked')![0]).toEqual([2])
  })

  it('shows fallback message when no chats exist', () => {
    const wrapper = mount(ChatListComponent, {
      props: {
        chats: []
      }
    })

    expect(wrapper.text()).toContain('Du har ingen aktive samtaler')
  })

  it('applies full width class on mobile', () => {
    const wrapper = mount(ChatListComponent, {
      props: {
        chats: mockChats,
        isMobile: true
      }
    })

    expect(wrapper.classes()).toContain('take-whole-width')
  })
})
