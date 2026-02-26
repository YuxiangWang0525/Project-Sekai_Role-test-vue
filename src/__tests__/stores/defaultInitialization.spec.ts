import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTestStore } from '@/stores/test'

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

describe('Default Options Initialization', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize localStorage with default values when empty', () => {
    // 确保localStorage为空
    expect(localStorage.getItem('sekai-role-test-options')).toBeNull()
    
    // 创建store实例（这会触发初始化）
    const store = useTestStore()
    
    // 验证store使用默认值
    expect(store.getWeightedMode()).toBe(true)
    expect(store.getMultiResultMode()).toBe(true)
    
    // 验证localStorage已被初始化
    const savedData = localStorage.getItem('sekai-role-test-options')
    expect(savedData).toBeTruthy()
    
    const parsedData = JSON.parse(savedData!)
    expect(parsedData.useWeightedMode).toBe(true)
    expect(parsedData.useMultiResultMode).toBe(true)
  })

  it('should not overwrite existing localStorage data', () => {
    // 先保存自定义数据
    const customData = {
      useWeightedMode: false,
      useMultiResultMode: false
    }
    localStorage.setItem('sekai-role-test-options', JSON.stringify(customData))
    
    // 创建store实例
    const store = useTestStore()
    
    // 验证加载了自定义数据
    expect(store.getWeightedMode()).toBe(false)
    expect(store.getMultiResultMode()).toBe(false)
    
    // 验证localStorage数据未被覆盖
    const savedData = localStorage.getItem('sekai-role-test-options')
    const parsedData = JSON.parse(savedData!)
    expect(parsedData.useWeightedMode).toBe(false)
    expect(parsedData.useMultiResultMode).toBe(false)
  })

  it('should handle the case where localStorage is empty on first visit', () => {
    // 模拟首次访问应用的场景
    localStorage.clear()
    
    // 第一次创建store
    const store1 = useTestStore()
    expect(store1.getWeightedMode()).toBe(true)
    expect(store1.getMultiResultMode()).toBe(true)
    
    // 验证localStorage已初始化
    const dataAfterFirstVisit = localStorage.getItem('sekai-role-test-options')
    expect(dataAfterFirstVisit).toBeTruthy()
    const parsed1 = JSON.parse(dataAfterFirstVisit!)
    expect(parsed1.useWeightedMode).toBe(true)
    expect(parsed1.useMultiResultMode).toBe(true)
    
    // 模拟第二次访问（刷新页面后）
    setActivePinia(createPinia())
    const store2 = useTestStore()
    expect(store2.getWeightedMode()).toBe(true)
    expect(store2.getMultiResultMode()).toBe(true)
  })

  it('should maintain consistency between store and localStorage defaults', () => {
    localStorage.clear()
    
    // 创建store实例
    const store = useTestStore()
    
    // 验证两者的一致性
    const localStorageData = JSON.parse(localStorage.getItem('sekai-role-test-options')!)
    expect(store.getWeightedMode()).toBe(localStorageData.useWeightedMode)
    expect(store.getMultiResultMode()).toBe(localStorageData.useMultiResultMode)
    
    // 修改选项
    store.setWeightedMode(false)
    
    // 验证同步
    const updatedLocalStorageData = JSON.parse(localStorage.getItem('sekai-role-test-options')!)
    expect(store.getWeightedMode()).toBe(updatedLocalStorageData.useWeightedMode)
    expect(updatedLocalStorageData.useWeightedMode).toBe(false)
  })
})