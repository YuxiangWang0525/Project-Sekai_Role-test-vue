import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QuestionCard from '@/components/QuestionCard.vue'
import type { Question } from '@/data'

const mockQuestion: Question = {
  text: '这是一个测试问题',
  dim: 0
}

describe('QuestionCard', () => {
  const defaultProps = {
    question: mockQuestion,
    dimensionName: '外向性',
    progress: '1/39',
    currentAnswer: 3,
    canGoNext: true,
    canGoPrev: false,
    isLastQuestion: false
  }

  it('should render question correctly', () => {
    const wrapper = mount(QuestionCard, {
      props: defaultProps
    })
    
    expect(wrapper.find('.question-text').text()).toBe(mockQuestion.text)
    expect(wrapper.find('.question-counter').text()).toContain('外向性')
    expect(wrapper.find('.slider-value').text()).toBe('3')
  })

  it('should emit update:answer event when slider value changes', async () => {
    const wrapper = mount(QuestionCard, {
      props: defaultProps
    })
    
    await wrapper.find('.control-btn:last-child').trigger('click')
    
    const emitted = wrapper.emitted('update:answer')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual([4])
  })

  it('should emit next event when next button is clicked', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        ...defaultProps,
        canGoNext: true
      }
    })
    
    await wrapper.find('.primary-button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('next')
  })

  it('should disable next button when canGoNext is false', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        ...defaultProps,
        canGoNext: false
      }
    })
    
    const nextButton = wrapper.find('.primary-button')
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('should show correct button text for last question', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        ...defaultProps,
        isLastQuestion: true
      }
    })
    
    expect(wrapper.find('.primary-button').text()).toBe('查看结果')
  })

  it('should handle slider track click', async () => {
    const wrapper = mount(QuestionCard, {
      props: defaultProps
    })
    
    const track = wrapper.find('.slider-track')
    await track.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('update:answer')
  })
})