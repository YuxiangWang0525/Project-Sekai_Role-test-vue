import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TestState, MatchResult, Character } from '@/data'
import { QUESTIONS, CHARACTERS, DIMENSION_NAMES } from '@/data'

const STORAGE_KEY = 'sekai-role-test-progress'

export const useTestStore = defineStore('test', () => {
  // 状态
  const currentIndex = ref(0)
  const answers = ref<(number | null)[]>(new Array(QUESTIONS.length).fill(null))
  const isCompleted = ref(false)
  const timestamp = ref<number>()

  // 计算属性
  const totalQuestions = computed(() => QUESTIONS.length)
  const currentQuestion = computed(() => QUESTIONS[currentIndex.value] || QUESTIONS[0])
  const progress = computed(() => `${currentIndex.value + 1}/${totalQuestions.value}`)
  const dimensionName = computed(() => {
    const question = QUESTIONS[currentIndex.value]
    if (question && question.dim < DIMENSION_NAMES.length) {
      return DIMENSION_NAMES[question.dim]
    }
    return DIMENSION_NAMES[0] || ''
  })
  
  const canGoNext = computed(() => {
    // 如果当前题目已有答案，或者有默认值（非null），则可以继续
    const currentAnswer = answers.value[currentIndex.value]
    return currentAnswer !== null && typeof currentAnswer === 'number' && currentAnswer >= 1 && currentAnswer <= 5
  })
  
  const canGoPrev = computed(() => {
    return currentIndex.value > 0
  })
  
  const isLastQuestion = computed(() => {
    return currentIndex.value === totalQuestions.value - 1
  })

  // 匹配结果计算
  const matchResult = computed((): MatchResult => {
    const dimSums = [0, 0, 0, 0, 0]
    const dimCounts = [0, 0, 0, 0, 0]
    
    // 计算用户各维度平均值
    for (let i = 0; i < QUESTIONS.length; i++) {
      const ans = answers.value[i]
      const question = QUESTIONS[i]
      if (ans !== null && question) {
        const dim = question.dim
        if (dim < dimSums.length && dim < dimCounts.length && 
            dimSums[dim] !== undefined && dimCounts[dim] !== undefined &&
            ans !== undefined) {
          dimSums[dim]! += ans
          dimCounts[dim]!++
        }
      }
    }
    
    const userAvg = dimSums.map((sum, idx) => {
      const count = dimCounts[idx]
      return count && count > 0 ? sum / count : 3
    })
    
    // 计算最匹配的角色
    let bestChar: Character = CHARACTERS[0] || { 
      id: 'unknown', 
      name: '未知角色', 
      color: '#CCCCCC', 
      desc: '暂无描述', 
      dim: [3, 3, 3, 3, 3] 
    }
    let minDist = Infinity
    
    for (const char of CHARACTERS) {
      let dist = 0
      for (let i = 0; i < 5; i++) {
        const userVal = userAvg[i]
        const charVal = char.dim[i]
        if (typeof userVal === 'number' && typeof charVal === 'number') {
          dist += Math.pow(userVal - charVal, 2)
        }
      }
      dist = Math.sqrt(dist)
      
      if (dist < minDist) {
        minDist = dist
        bestChar = char
      }
    }
    
    // 计算匹配百分比
    const maxDist = Math.sqrt(5 * 16)
    const matchPercent = Math.max(0, Math.min(100, Math.round(100 * (1 - minDist / maxDist))))
    
    return {
      character: bestChar,
      percentage: matchPercent
    }
  })

  // 方法
  function setAnswer(value: number) {
    answers.value[currentIndex.value] = value
  }
  
  function goToNext() {
    if (canGoNext.value && currentIndex.value < totalQuestions.value - 1) {
      currentIndex.value++
      saveProgress() // 切换题目时保存进度
    }
  }
  
  function goToPrev() {
    if (canGoPrev.value) {
      currentIndex.value--
      saveProgress() // 切换题目时保存进度
    }
  }
  
  function completeTest() {
    isCompleted.value = true
    timestamp.value = Date.now()
    saveProgress()
  }
  
  function resetTest() {
    currentIndex.value = 0
    answers.value = new Array(QUESTIONS.length).fill(null)
    isCompleted.value = false
    timestamp.value = undefined
    localStorage.removeItem(STORAGE_KEY)
  }
  
  function saveProgress() {
    // 确保有timestamp
    if (!timestamp.value) {
      timestamp.value = Date.now()
    }
    const state: TestState = {
      currentIndex: currentIndex.value,
      answers: [...answers.value],
      isCompleted: isCompleted.value,
      timestamp: timestamp.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  
  function loadProgress(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const state: TestState = JSON.parse(saved)
        if (state.timestamp && Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
          // 超过24小时的数据自动清除
          localStorage.removeItem(STORAGE_KEY)
          return false
        }
        
        currentIndex.value = state.currentIndex
        answers.value = [...state.answers]
        isCompleted.value = state.isCompleted
        timestamp.value = state.timestamp
        return true
      } catch (e) {
        console.error('Failed to load progress:', e)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    return false
  }
  
  function hasSavedProgress(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY)
    console.log('检查保存进度 - localStorage数据:', saved)
    if (saved) {
      try {
        const state: TestState = JSON.parse(saved)
        const isValid = Date.now() - (state.timestamp || 0) <= 24 * 60 * 60 * 1000
        console.log('进度有效性检查 - 时间差:', Date.now() - (state.timestamp || 0), '有效:', isValid)
        return isValid
      } catch (e) {
        console.error('解析保存进度失败:', e)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    console.log('没有找到保存的进度')
    return false
  }

  return {
    // 状态
    currentIndex,
    answers,
    isCompleted,
    timestamp,
    
    // 计算属性
    totalQuestions,
    currentQuestion,
    progress,
    dimensionName,
    canGoNext,
    canGoPrev,
    isLastQuestion,
    matchResult,
    
    // 方法
    setAnswer,
    goToNext,
    goToPrev,
    completeTest,
    resetTest,
    saveProgress,
    loadProgress,
    hasSavedProgress
  }
})