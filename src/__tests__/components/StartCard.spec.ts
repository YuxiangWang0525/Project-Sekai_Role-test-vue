import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StartCard from '@/components/StartCard.vue'

describe('StartCard', () => {
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