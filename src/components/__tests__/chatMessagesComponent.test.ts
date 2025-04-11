import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessagesComponent from '@/components/chat/MessagesListComponent.vue'
import flushPromises from 'flush-promises'

// Mock WebSocketService
const connectMock = vi.fn()
const closeMock = vi.fn()
const sendMessageMock = vi.fn()
const onMessageMock = vi.fn()

vi.mock('@/services/websocketService', () => ({
  WebSocketService: vi.fn().mockImplementation(() => ({
    connect: connectMock,
    close: closeMock,
    sendMessage: sendMessageMock,
    onMessage: onMessageMock
  }))
}))

vi.mock('@/components/chat/Message.vue', () => ({
    default: {
      props: ['user', 'message', 'timestamp', 'avatar', 'name'],
      template: '<div class="mock-message">{{ message }}</div>'
    }
  }))
  

vi.mock('@/components/FadeInComponent.vue', () => ({
  default: {
    props: ['duration', 'direction'],
    template: '<div class="mock-fade"><slot /></div>'
  }
}))

describe('ChatMessagesComponent.vue', () => {
  const sampleMessages = [
    { id: 1, message: 'Hello', sentByMe: true, timestamp: '10:00' },
    { id: 2, message: 'Hi!', sentByMe: false, timestamp: '10:01' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial messages', async () => {
    const wrapper = mount(ChatMessagesComponent, {
      props: {
        messages: sampleMessages,
        chatId: 1,
        token: 'token123',
        name: 'Test User',
        avatar: '/avatar.png',
        myAvatar: '/me.png',
        isMobile: false
      }
    })

    await flushPromises()

    const messages = wrapper.findAll('.mock-message')
    expect(messages.length).toBe(2)
    expect(messages[0].text()).toBe('Hello')
    expect(messages[1].text()).toBe('Hi!')
  })

  it('sends message on button click', async () => {
    const wrapper = mount(ChatMessagesComponent, {
      props: {
        messages: [],
        chatId: 1,
        token: 'token123',
        name: 'Test User',
        avatar: '/avatar.png',
        myAvatar: '/me.png',
        isMobile: false
      }
    })

    await wrapper.find('input.message-input').setValue('New test message')
    await wrapper.find('button.send-button').trigger('click')

    expect(sendMessageMock).toHaveBeenCalled()
    expect(wrapper.findAll('.mock-message').length).toBe(1)
    expect(wrapper.text()).toContain('New test message')
  })

  it('sends message on Enter keypress', async () => {
    const wrapper = mount(ChatMessagesComponent, {
      props: {
        messages: [],
        chatId: 1,
        token: 'token123',
        name: 'Test User',
        avatar: '/avatar.png',
        myAvatar: '/me.png',
        isMobile: false
      }
    })

    const input = wrapper.find('input.message-input')
    await input.setValue('Keyboard message')
    await input.trigger('keyup.enter')

    expect(sendMessageMock).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Keyboard message')
  })

  it('emits return event on back button click (mobile)', async () => {
    const wrapper = mount(ChatMessagesComponent, {
      props: {
        messages: [],
        chatId: 1,
        token: 'token123',
        name: 'Test User',
        avatar: '/avatar.png',
        myAvatar: '/me.png',
        isMobile: true
      }
    })

    await wrapper.find('button.back-button').trigger('click')
    expect(wrapper.emitted('return')).toBeTruthy()
  })

  it('calls connect and sets up websocket on mount', () => {
    mount(ChatMessagesComponent, {
      props: {
        messages: [],
        chatId: 123,
        token: 'abc',
        name: 'Chat',
        avatar: '/a.png',
        myAvatar: '/m.png',
        isMobile: false
      }
    })

    expect(connectMock).toHaveBeenCalled()
    expect(onMessageMock).toHaveBeenCalled()
  })

  it('closes WebSocket on unmount', () => {
    const wrapper = mount(ChatMessagesComponent, {
      props: {
        messages: [],
        chatId: 1,
        token: 'abc',
        name: 'Chat',
        avatar: '/a.png',
        myAvatar: '/m.png',
        isMobile: false
      }
    })

    wrapper.unmount()
    expect(closeMock).toHaveBeenCalled()
  })
})
