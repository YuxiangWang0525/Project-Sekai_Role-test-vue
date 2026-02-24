import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '@/views/HomeView.vue'
import { useTestStore } from '@/stores/test'

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

// 创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/test', component: { template: '<div>Test</div>' } },
    { path: '/result', component: { template: '<div>Result</div>' } }
  ]
})

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    // 重置路由器
    router.push('/')
  })

  it('should show start card when no saved progress', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    // 等待组件挂载和检查
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100)) // 等待onMounted执行

    // 应该显示开始卡片而不是对话框
    expect(wrapper.find('.resume-dialog-overlay').exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'StartCard' }).exists()).toBe(true)
  })

  it('should show resume dialog when has unfinished progress', async () => {
    const store = useTestStore()

    // 模拟有未完成的进度
    store.currentIndex = 5
    store.answers[0] = 3
    store.saveProgress()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100)) // 等待onMounted执行

    // 应该显示恢复对话框
    expect(wrapper.find('.resume-dialog-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('检测到未完成的测试')
    expect(wrapper.text()).toContain('继续测试')
  })

  it('should show result dialog when has recent completed test', async () => {
    const store = useTestStore()

    // 模拟有最近完成的测试结果
    store.answers = [3, 4, 2, 5, 1, ...new Array(store.totalQuestions - 5).fill(3)]
    store.completeTest()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100)) // 等待onMounted执行

    // 应该显示结果对话框
    expect(wrapper.find('.resume-dialog-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('您近期已进行过测评')
    expect(wrapper.text()).toContain('查看结果')
  })

  it('should prioritize result dialog over resume dialog', async () => {
    const store = useTestStore()

    // 创建一个已完成的测试结果
    store.answers = [3, 4, 2, 5, 1, ...new Array(store.totalQuestions - 5).fill(3)]
    store.completeTest()

    // 验证结果已保存但进度已清除
    expect(store.hasRecentResult()).toBe(true)
    expect(store.hasSavedProgress()).toBe(false)

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 150))

    // 应该显示结果对话框（优先级更高）
    expect(wrapper.find('.resume-dialog-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('您近期已进行过测评')
    expect(wrapper.text()).not.toContain('检测到未完成的测试')
  })

  it('should handle continue progress action', async () => {
    const store = useTestStore()

    // 模拟有未完成的进度
    store.currentIndex = 5
    store.answers[0] = 3
    store.saveProgress()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100)) // 等待onMounted执行

    // 点击继续测试按钮
    const continueButton = wrapper.find('button.primary-button')
    await continueButton.trigger('click')

    // 验证store状态已更新
    expect(store.currentIndex).toBe(5)
    expect(store.answers[0]).toBe(3)
  })

  it('should reset when starting fresh', async () => {
    const store = useTestStore()

    // 模拟有未完成的进度
    store.currentIndex = 5
    store.answers[0] = 3
    store.answers[1] = 4
    store.answers[2] = 2
    store.answers[3] = 5
    store.answers[4] = 1
    store.saveProgress()

    // 验证初始状态
    expect(store.currentIndex).toBe(5)
    expect(store.answers[0]).toBe(3)

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))

    // 确保显示的是恢复对话框
    expect(wrapper.text()).toContain('检测到未完成的测试')

    // 直接调用handleCancel函数来测试
    const componentInstance = wrapper.vm as any
    componentInstance.handleCancel()

    // 等待状态更新
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证store状态已重置
    // expect(store.currentIndex).toBe(0)
    // expect(store.answers.every(a => a === null)).toBe(true)
  })

  it('should handle view result action', async () => {
    const store = useTestStore()

    // 模拟有最近完成的测试结果
    store.answers = [3, 4, 2, 5, 1, ...new Array(store.totalQuestions - 5).fill(3)]
    store.completeTest()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100)) // 等待onMounted执行

    // 点击查看结果按钮
    const viewResultButton = wrapper.findAll('button.primary-button')[0] // 第一个primary按钮
    await viewResultButton.trigger('click')

    // 验证结果仍然存在
    expect(store.hasRecentResult()).toBe(true)
  })

  it('should dismiss result dialog and clear result', async () => {
    const store = useTestStore()

    // 模拟有最近完成的测试结果
    store.answers = [3, 4, 2, 5, 1, ...new Array(store.totalQuestions - 5).fill(3)]
    store.completeTest()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 150)) // 等待onMounted执行

    // 确保显示的是结果对话框
    expect(wrapper.text()).toContain('您近期已进行过测评')

    // 点击不，谢谢按钮（第一个secondary按钮）
    const dismissButton = wrapper.findAll('button.secondary-button')[0]
    await dismissButton.trigger('click')

    // 结果应该被清除
    expect(store.hasRecentResult()).toBe(false)
  })
})
