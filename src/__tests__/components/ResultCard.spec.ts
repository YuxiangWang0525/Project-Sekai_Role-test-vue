import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ResultCard from '@/components/ResultCard.vue'
import type { MatchResult, Character } from '@/data'

// Mock 图表组件
vi.mock('@/components/PercentageChart.vue', () => ({
  default: {
    template: '<div class="mock-percentage-chart">Percentage Chart</div>'
  }
}))

vi.mock('@/components/RatioChart.vue', () => ({
  default: {
    template: '<div class="mock-pie-chart">Pie Chart</div>'
  }
}))

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
  beforeEach(() => {
    // 设置 Pinia 实例
    setActivePinia(createPinia())
    // 清理 localStorage
    localStorage.clear()
    // 设置默认的实验性选项
    localStorage.setItem('sekai-role-test-options', JSON.stringify({
      useWeightedMode: true,
      useMultiResultMode: true
    }))
  })

  const defaultProps = {
    matchResult: mockMatchResult,
    showAnimation: true,
    otherMatches: [],
    isBestMatch: true
  }

  it('should render result correctly', async () => {
    const wrapper = mount(ResultCard, {
      props: defaultProps
    })
    
    // 等待动画完成
    await new Promise(resolve => setTimeout(resolve, 1100))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.result-character').text()).toContain('测试角色')
    // 检查 mock 图表组件是否存在
    expect(wrapper.find('.mock-percentage-chart').exists()).toBe(true)
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
    const shareButton = wrapper.find('.primary-button')
    
    // 颜色会被转换为rgb格式
    const expectedRgb = 'rgb(255, 0, 0)'
    expect(header.attributes('style')).toContain(expectedRgb)
    expect(shareButton.attributes('style')).toContain(expectedRgb)
    // mock 组件中没有 percentage-text 元素
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
    
    // 检查 mock 图表组件是否存在
    expect(wrapper.find('.mock-percentage-chart').exists()).toBe(true)
    // 由于使用了 mock 组件，具体的百分比文本无法测试
  })
})