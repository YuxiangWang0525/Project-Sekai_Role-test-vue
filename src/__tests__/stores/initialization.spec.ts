import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTestStore } from '@/stores/test'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { 
      store[key] = value.toString()
    },
    removeItem: (key: string) => { 
      delete store[key]
    },
    clear: () => { 
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock,
  writable: true
})

describe('Store Initialization with localStorage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should load options from localStorage during store initialization', () => {
    // 准备测试数据
    const testData = {
      useWeightedMode: false,
      useMultiResultMode: false
    }
    localStorage.setItem('sekai-role-test-options', JSON.stringify(testData))
    
    // 创建store实例（这会触发初始化加载）
    const store = useTestStore()
    
    // 验证选项被正确加载
    expect(store.getWeightedMode()).toBe(false)
    expect(store.getMultiResultMode()).toBe(false)
  })

  it('should use default values when no localStorage data exists', () => {
    // 确保localStorage为空
    localStorage.clear()
    
    // 创建store实例
    const store = useTestStore()
    
    // 验证使用默认值
    expect(store.getWeightedMode()).toBe(true)
    expect(store.getMultiResultMode()).toBe(true)
  })

  it('should handle corrupted localStorage data gracefully', () => {
    // 设置损坏的数据
    localStorage.setItem('sekai-role-test-options', 'invalid json data')
    
    // 创建store实例
    const store = useTestStore()
    
    // 应该回退到默认值
    expect(store.getWeightedMode()).toBe(true)
    expect(store.getMultiResultMode()).toBe(true)
  })

  it('should handle partial localStorage data', () => {
    // 设置只有部分选项的数据
    const partialData = {
      useWeightedMode: false
      // 缺少 useMultiResultMode
    }
    localStorage.setItem('sekai-role-test-options', JSON.stringify(partialData))
    
    // 创建store实例
    const store = useTestStore()
    
    // 应该加载存在的选项，缺失的使用默认值
    expect(store.getWeightedMode()).toBe(false)
    expect(store.getMultiResultMode()).toBe(true) // 默认值
  })

  it('should initialize with correct default values when localStorage is empty', () => {
    // 清空localStorage
    localStorage.clear()
    
    // 创建多个store实例来测试一致性
    const store1 = useTestStore()
    setActivePinia(createPinia())
    const store2 = useTestStore()
    
    // 所有实例都应该使用相同的默认值
    expect(store1.getWeightedMode()).toBe(true)
    expect(store1.getMultiResultMode()).toBe(true)
    expect(store2.getWeightedMode()).toBe(true)
    expect(store2.getMultiResultMode()).toBe(true)
  })
})