import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTestStore } from '@/stores/test'
import { QUESTIONS, CHARACTERS } from '@/data'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => {
      const result = store[key] || null
      console.log('localStorage.getItem', key, '->', result)
      return result
    },
    setItem: (key: string, value: string) => { 
      store[key] = value.toString()
      console.log('localStorage.setItem', key, '->', value)
    },
    removeItem: (key: string) => { 
      delete store[key]
      console.log('localStorage.removeItem', key)
    },
    clear: () => { 
      store = {}
      console.log('localStorage.clear')
    }
  }
})()

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock,
  writable: true
})

describe('Test Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 清理localStorage确保测试环境干净
    localStorage.clear()
  })

  it('should initialize with correct default values', () => {
    const store = useTestStore()
    
    expect(store.currentIndex).toBe(0)
    expect(store.answers).toHaveLength(QUESTIONS.length)
    expect(store.answers.every(answer => answer === null)).toBe(true)
    expect(store.isCompleted).toBe(false)
    expect(store.totalQuestions).toBe(QUESTIONS.length)
  })

  it('should set answer correctly', () => {
    const store = useTestStore()
    const testValue = 3
    
    store.setAnswer(testValue)
    
    expect(store.answers[0]).toBe(testValue)
    expect(store.canGoNext).toBe(true)
  })

  it('should navigate between questions', () => {
    const store = useTestStore()
    
    // 设置当前答案才能前进
    store.setAnswer(3)
    expect(store.canGoNext).toBe(true)
    
    // 前往下一页（应该自动保存进度）
    store.goToNext()
    expect(store.currentIndex).toBe(1)
    
    // 返回上一页（应该自动保存进度）
    store.goToPrev()
    expect(store.currentIndex).toBe(0)
  })

  it('should detect last question', () => {
    const store = useTestStore()
    
    // 移动到最后一个问题
    store.currentIndex = QUESTIONS.length - 1
    store.setAnswer(3)
    
    expect(store.isLastQuestion).toBe(true)
    expect(store.canGoNext).toBe(true)
  })

  it('should have default answer validation', () => {
    const store = useTestStore()
    
    // 初始状态下不能前进
    expect(store.canGoNext).toBe(false)
    
    // 设置有效答案后可以前进
    store.setAnswer(3)
    expect(store.canGoNext).toBe(true)
    
    // 设置无效答案后不能前进
    store.answers[store.currentIndex] = null
    expect(store.canGoNext).toBe(false)
    
    // 设置边界值
    store.setAnswer(1)
    expect(store.canGoNext).toBe(true)
    store.setAnswer(5)
    expect(store.canGoNext).toBe(true)
  })

  it('should complete test and handle result storage', () => {
    const store = useTestStore()
    
    const now = Date.now()
    vi.setSystemTime(now)
    
    // 设置一些答案以便计算结果
    store.answers = [3, 4, 2, 5, 1, ...new Array(QUESTIONS.length - 5).fill(3)]
    
    store.completeTest()
    
    expect(store.isCompleted).toBe(true)
    expect(store.timestamp).toBe(now)
    
    // 验证进度已被清除但结果已保存
    const progressData = localStorage.getItem('sekai-role-test-progress')
    const resultData = localStorage.getItem('sekai-role-test-result')
    
    expect(progressData).toBeFalsy()
    expect(resultData).toBeTruthy()
    
    // 验证结果数据包含必要字段
    const parsedResult = JSON.parse(resultData!)
    expect(parsedResult.timestamp).toBe(now)
    expect(parsedResult.matchResult).toBeDefined()
    expect(parsedResult.answers).toBeDefined()
  })

  it('should calculate match result correctly', () => {
    const store = useTestStore()
    
    // 设置一些答案
    store.answers = [3, 4, 2, 5, 1, ...new Array(QUESTIONS.length - 5).fill(3)]
    
    const result = store.matchResult
    
    expect(result.character).toBeDefined()
    expect(result.percentage).toBeGreaterThanOrEqual(0)
    expect(result.percentage).toBeLessThanOrEqual(100)
    expect(CHARACTERS).toContain(result.character)
  })

  it('should handle progress persistence', () => {
    const store = useTestStore()
    
    // 设置一些进度
    store.currentIndex = 5
    const testAnswers = [3, 4, 2, 5, 1, 3]
    testAnswers.forEach((answer, index) => {
      store.answers[index] = answer
    })
    
    // 保存进度
    store.saveProgress()
    
    // 验证数据已保存
    const savedData = localStorage.getItem('sekai-role-test-progress')
    expect(savedData).toBeTruthy()
    
    // 创建新的store实例来模拟页面刷新
    const newStore = useTestStore()
    
    // 加载进度
    const loaded = newStore.loadProgress()
    expect(loaded).toBe(true)
    expect(newStore.currentIndex).toBe(5)
    expect(newStore.answers[0]).toBe(3)
    expect(newStore.answers[5]).toBe(3)
  })
  
  it('should clear result when requested', () => {
    const store = useTestStore()
    
    // 保存一个结果
    const mockResult = {
      character: CHARACTERS[0],
      percentage: 85
    }
    localStorage.setItem('sekai-role-test-result', JSON.stringify({
      matchResult: mockResult,
      timestamp: Date.now(),
      answers: [3, 4, 2, 5, 1]
    }))
    
    expect(store.hasRecentResult()).toBe(true)
    
    // 清除结果
    store.clearResult()
    
    expect(store.hasRecentResult()).toBe(false)
    expect(localStorage.getItem('sekai-role-test-result')).toBeFalsy()
  })
  
  it('should handle expired results', () => {
    const store = useTestStore()
    
    // 保存一个过期的结果（25小时前）
    const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000)
    const mockResult = {
      character: CHARACTERS[0],
      percentage: 85
    }
    localStorage.setItem('sekai-role-test-result', JSON.stringify({
      matchResult: mockResult,
      timestamp: oldTimestamp,
      answers: [3, 4, 2, 5, 1]
    }))
    
    expect(store.hasRecentResult()).toBe(false) // 应该被认为是过期的
    
    // 获取结果应该返回null
    expect(store.getLastResult()).toBeNull()
  })

  it('should detect saved progress and recent results', () => {
    const store = useTestStore()
    
    // 没有保存进度时
    expect(store.hasSavedProgress()).toBe(false)
    expect(store.hasRecentResult()).toBe(false)
    
    // 保存进度后
    store.saveProgress()
    
    // 验证localStorage中有数据
    const savedData = localStorage.getItem('sekai-role-test-progress')
    expect(savedData).toBeTruthy()
    
    expect(store.hasSavedProgress()).toBe(true)
    expect(store.hasRecentResult()).toBe(false)
    
    // 保存结果后
    const now = Date.now()
    vi.setSystemTime(now)
    store.completeTest()
    
    expect(store.hasSavedProgress()).toBe(false) // 进度应该被清除
    expect(store.hasRecentResult()).toBe(true) // 应该有最近结果
    
    // 获取最近结果
    const lastResult = store.getLastResult()
    expect(lastResult).toBeDefined()
    expect(lastResult!.character).toBeDefined()
    expect(lastResult!.percentage).toBeDefined()
  })

  it('should reset test properly without clearing results', () => {
    const store = useTestStore()
    
    // 设置一些状态
    store.currentIndex = 10
    store.answers[0] = 3
    store.isCompleted = true
    
    // 保存一个结果
    const mockResult = {
      character: CHARACTERS[0],
      percentage: 85
    }
    localStorage.setItem('sekai-role-test-result', JSON.stringify({
      matchResult: mockResult,
      timestamp: Date.now(),
      answers: [3, 4, 2, 5, 1]
    }))
    
    store.resetTest()
    
    expect(store.currentIndex).toBe(0)
    expect(store.answers.every(a => a === null)).toBe(true)
    expect(store.isCompleted).toBe(false)
    
    // 验证结果数据仍然存在
    const resultData = localStorage.getItem('sekai-role-test-result')
    expect(resultData).toBeTruthy()
  })
})