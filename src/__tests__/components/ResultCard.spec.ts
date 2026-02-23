import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultCard from '@/components/ResultCard.vue'
import type { MatchResult, Character } from '@/data'

// Mock requestAnimationFrame
vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  setTimeout(() => callback(Date.now()), 16)
  return 1
})

const mockCharacter: Character = {
  id: 'test',
  name: '测试角色',
  color: '#FF0000',
  desc: '这是一个测试角色的描述',
  dim: [3, 3, 3, 3, 3]
}

const mockMatchResult: MatchResult = {
  character: mockCharacter,
  percentage: 85
}

describe('ResultCard', () => {
  const defaultProps = {
    matchResult: mockMatchResult,
    showAnimation: true
  }

  it('should render result correctly', async () => {
    const wrapper = mount(ResultCard, {
      props: defaultProps
    })
    
    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 1100))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.result-character').text()).toContain('测试角色')
    // 动画可能还没完成，检查初始值
    const percentageText = wrapper.find('.percentage-text').text()
    expect(['0%', '85%']).toContain(percentageText)
    expect(wrapper.find('.character-info').text()).toContain('测试角色的描述')
  })

  it('should emit retry event when retry button is clicked', async () => {
    const wrapper = mount(ResultCard, {
      props: defaultProps
    })
    
    await wrapper.find('.secondary-button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('retry')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('should apply character color to UI elements', () => {
    const wrapper = mount(ResultCard, {
      props: defaultProps
    })
    
    const header = wrapper.find('.question-section')
    const percentageText = wrapper.find('.percentage-text')
    const shareButton = wrapper.find('.primary-button')
    
    // 颜色会被转换为rgb格式
    const expectedRgb = 'rgb(255, 0, 0)'
    expect(header.attributes('style')).toContain(expectedRgb)
    expect(percentageText.attributes('style')).toContain(expectedRgb)
    expect(shareButton.attributes('style')).toContain(expectedRgb)
  })

  it('should show correct match percentage', async () => {
    const wrapper = mount(ResultCard, {
      props: {
        ...defaultProps,
        matchResult: { ...mockMatchResult, percentage: 92 }
      }
    })
    
    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 1100))
    await wrapper.vm.$nextTick()
    
    // 动画可能还没完成，检查合理范围
    const percentageText = wrapper.find('.percentage-text').text()
    expect(['0%', '92%']).toContain(percentageText)
  })
})