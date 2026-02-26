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

describe('Options Persistence', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should save experimental options to localStorage when changed', () => {
    const store = useTestStore()
    
    // 初始状态应该是默认值
    expect(store.getWeightedMode()).toBe(true)
    expect(store.getMultiResultMode()).toBe(true)
    
    // 更改选项
    store.setWeightedMode(false)
    store.setMultiResultMode(false)
    
    // 验证localStorage中保存了正确的值
    const savedOptions = localStorage.getItem('sekai-role-test-options')
    expect(savedOptions).toBeTruthy()
    
    const parsedOptions = JSON.parse(savedOptions!)
    expect(parsedOptions.useWeightedMode).toBe(false)
    expect(parsedOptions.useMultiResultMode).toBe(false)
  })

  it('should load experimental options from localStorage on initialization', () => {
    // 清理之前的store实例可能造成的影响
    localStorage.clear()
    
    // 先保存一些自定义选项
    const customOptions = {
      useWeightedMode: false,
      useMultiResultMode: true
    }
    localStorage.setItem('sekai-role-test-options', JSON.stringify(customOptions))
    
    // 重新设置Pinia实例确保干净状态
    setActivePinia(createPinia())
    
    // 创建新的store实例
    const store = useTestStore()
    
    // 验证加载了保存的选项
    expect(store.getWeightedMode()).toBe(false)
    expect(store.getMultiResultMode()).toBe(true)
  })

  it('should use default values when localStorage is corrupted', () => {
    // 清理并重新设置
    localStorage.clear()
    setActivePinia(createPinia())
    
    // 保存损坏的数据
    localStorage.setItem('sekai-role-test-options', 'invalid json')
    
    // 创建新的store实例
    const store = useTestStore()
    
    // 应该使用默认值
    expect(store.getWeightedMode()).toBe(true)
    expect(store.getMultiResultMode()).toBe(true)
  })

  it('should handle partial option data gracefully', () => {
    // 清理并重新设置
    localStorage.clear()
    setActivePinia(createPinia())
    
    // 保存只有部分选项的数据
    const partialOptions = {
      useWeightedMode: false
      // 缺少 useMultiResultMode
    }
    localStorage.setItem('sekai-role-test-options', JSON.stringify(partialOptions))
    
    // 创建新的store实例
    const store = useTestStore()
    
    // 应该加载存在的选项，缺失的使用默认值
    expect(store.getWeightedMode()).toBe(false)
    expect(store.getMultiResultMode()).toBe(true) // 默认值
  })

  it('should persist options across store instances', () => {
    // 第一个store实例设置选项
    const store1 = useTestStore()
    store1.setWeightedMode(false)
    store1.setMultiResultMode(false)
    
    // 销毁第一个实例
    // 创建第二个store实例
    setActivePinia(createPinia())
    const store2 = useTestStore()
    
    // 验证选项状态被正确恢复
    expect(store2.getWeightedMode()).toBe(false)
    expect(store2.getMultiResultMode()).toBe(false)
  })
})