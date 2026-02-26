import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StartCard from '@/components/StartCard.vue'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString() },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

describe('StartCard', () => {
  beforeEach(() => {
    // 设置 Pinia 实例
    setActivePinia(createPinia())
  })

  it('should render correctly', () => {
    const wrapper = mount(StartCard)
    
    expect(wrapper.find('.question-text').text()).toContain('哪颗心与你共鸣')
    expect(wrapper.find('.disclaimer').exists()).toBe(true)
    expect(wrapper.find('.test-button').exists()).toBe(true)
  })

  it('should emit start event when button is clicked', async () => {
    const wrapper = mount(StartCard)
    
    await wrapper.find('.test-button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted('start')).toHaveLength(1)
  })
})