import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TestState, MatchResult, Character } from '@/data'
import { QUESTIONS, CHARACTERS, DIMENSION_NAMES } from '@/data'

// 扩展MatchResult类型以支持多结果
export interface ExtendedMatchResult extends MatchResult {
  rank: number
  isBestMatch: boolean
}

// 添加实验性选项状态
const useWeightedMode = ref(true)
const useMultiResultMode = ref(true)

// 添加昵称状态
const nickname = ref('你')

// 存储键
const OPTIONS_STORAGE_KEY = 'sekai-role-test-options'
const NICKNAME_STORAGE_KEY = 'sekai-role-test-nickname'

// 从localStorage加载昵称
function loadNickname() {
  const saved = localStorage.getItem(NICKNAME_STORAGE_KEY)
  if (saved) {
    try {
      nickname.value = saved
    } catch (e) {
      console.error('解析昵称失败:', e)
      nickname.value = '你'
    }
  }
}

// 保存昵称到localStorage
function saveNickname(name: string) {
  nickname.value = name
  localStorage.setItem(NICKNAME_STORAGE_KEY, name)
}

// 从localStorage加载实验性选项状态
function loadExperimentalOptions() {
  console.log('开始加载实验性选项状态')
  const saved = localStorage.getItem(OPTIONS_STORAGE_KEY)
  console.log('从localStorage读取到的数据:', saved)
  
  // 默认值
  let weightedMode = true
  let multiResultMode = true
  
  if (saved) {
    try {
      const options = JSON.parse(saved)
      console.log('解析后的选项数据:', options)
      
      if (typeof options.useWeightedMode === 'boolean') {
        weightedMode = options.useWeightedMode
        console.log('设置useWeightedMode为:', options.useWeightedMode)
      }
      if (typeof options.useMultiResultMode === 'boolean') {
        multiResultMode = options.useMultiResultMode
        console.log('设置useMultiResultMode为:', options.useMultiResultMode)
      }
    } catch (e) {
      console.error('解析实验性选项失败:', e)
      // 使用默认值
      console.log('使用默认值 due to parsing error')
    }
  } else {
    console.log('localStorage中没有找到实验性选项数据，使用默认值')
    // 重要：当localStorage为空时，初始化默认值到localStorage
    saveDefaultOptions()
  }
  
  // 统一设置值
  useWeightedMode.value = weightedMode
  useMultiResultMode.value = multiResultMode
  console.log('加载实验性选项状态完成:', { useWeightedMode: useWeightedMode.value, useMultiResultMode: useMultiResultMode.value })
}

// 保存默认选项到localStorage
function saveDefaultOptions() {
  const defaultOptions = {
    useWeightedMode: true,
    useMultiResultMode: true
  }
  localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(defaultOptions))
  console.log('已将默认选项保存到localStorage:', defaultOptions)
}

// 保存实验性选项状态到localStorage
function saveExperimentalOptions() {
  const options = {
    useWeightedMode: useWeightedMode.value,
    useMultiResultMode: useMultiResultMode.value
  }
  localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  console.log('保存实验性选项状态:', options)
}

const STORAGE_KEY = 'sekai-role-test-progress'
const RESULT_STORAGE_KEY = 'sekai-role-test-result'

export const useTestStore = defineStore('test', () => {
  // 初始化时加载状态
  loadNickname()
  loadExperimentalOptions()
  
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

  // 预计算全体角色各维度均值（用于加权算法）
  const dimMeans: number[] = [0, 0, 0, 0, 0]
  CHARACTERS.forEach(char => {
    for (let i = 0; i < 5; i++) {
      if (char.dim && char.dim[i] !== undefined) {
        (dimMeans[i] as number) += char.dim[i]!
      }
    }
  })
  for (let i = 0; i < 5; i++) {
    (dimMeans[i] as number) /= CHARACTERS.length
  }

  // 计算所有角色的匹配度，返回按匹配度降序排列的数组
  const allMatches = computed((): ExtendedMatchResult[] => {
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

    const maxDist = Math.sqrt(5 * 16)
    
    // 计算所有角色的匹配度
    const matches = CHARACTERS.map(char => {
      let dist: number
      
      if (useWeightedMode.value) {
        // 加权欧氏距离：权重 = 1 + 0.5 * |char.dim[i] - dimMeans[i]|
        let sum = 0
        for (let i = 0; i < 5; i++) {
          if (char.dim && char.dim[i] !== undefined && 
              userAvg[i] !== undefined) {
            const weight = 1 + 0.5 * Math.abs(char.dim[i]! - (dimMeans[i] as number))
            sum += weight * Math.pow(userAvg[i]! - char.dim[i]!, 2)
          }
        }
        dist = Math.sqrt(sum)
      } else {
        // 普通欧氏距离
        let sum = 0
        for (let i = 0; i < 5; i++) {
          if (char.dim && char.dim[i] !== undefined && userAvg[i] !== undefined) {
            sum += Math.pow(userAvg[i]! - char.dim[i]!, 2)
          }
        }
        dist = Math.sqrt(sum)
      }
      
      const percent = Math.max(0, Math.min(100, Math.round(100 * (1 - dist / maxDist))))
      return { char, percent, dist }
    })

    // 按匹配度降序排序并添加排名信息
    matches.sort((a, b) => b.percent - a.percent)
    
    return matches.map((match, index) => ({
      character: match.char,
      percentage: match.percent,
      rank: index + 1,
      isBestMatch: index === 0
    }))
  })

  // 主要匹配结果（最佳匹配）
  const matchResult = computed((): MatchResult => {
    const bestMatch = allMatches.value[0]
    return {
      character: bestMatch?.character || CHARACTERS[0] || {
        id: 'unknown',
        name: '未知角色',
        color: '#CCCCCC',
        desc: '暂无描述',
        dim: [3, 3, 3, 3, 3]
      },
      percentage: bestMatch?.percentage || 0
    }
  })

  // 其他高匹配角色（匹配度>=60%且不是第一名）
  const otherHighMatches = computed((): ExtendedMatchResult[] => {
    if (!useMultiResultMode.value) return []
    
    const bestMatchId = matchResult.value.character.id
    return allMatches.value
      .filter(match => match.percentage >= 60 && match.character.id !== bestMatchId)
      .slice(0, 8) // 最多显示8个
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
    // 保存结果信息
    const resultInfo = {
      matchResult: matchResult.value,
      timestamp: timestamp.value,
      answers: [...answers.value]
    }
    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(resultInfo))
    // 清除进度信息但保留结果
    localStorage.removeItem(STORAGE_KEY)
  }

  function resetTest() {
    currentIndex.value = 0
    answers.value = new Array(QUESTIONS.length).fill(null)
    isCompleted.value = false
    timestamp.value = undefined
    localStorage.removeItem(STORAGE_KEY)
    // 不清除结果信息，让用户可以选择查看历史结果
  }

  // 实验性选项设置
  function setWeightedMode(enabled: boolean) {
    useWeightedMode.value = enabled
    saveExperimentalOptions()
  }
  
  function setMultiResultMode(enabled: boolean) {
    useMultiResultMode.value = enabled
    saveExperimentalOptions()
  }

  function getWeightedMode() {
    return useWeightedMode.value
  }

  function getMultiResultMode() {
    return useMultiResultMode.value
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
    return false
  }

  function hasRecentResult(): boolean {
    const saved = localStorage.getItem(RESULT_STORAGE_KEY)
    if (saved) {
      try {
        const resultInfo = JSON.parse(saved)
        const isValid = Date.now() - (resultInfo.timestamp || 0) <= 24 * 60 * 60 * 1000
        return isValid
      } catch (e) {
        console.error('解析保存结果失败:', e)
        localStorage.removeItem(RESULT_STORAGE_KEY)
      }
    }
    return false
  }

  function getLastResult() {
    const saved = localStorage.getItem(RESULT_STORAGE_KEY)
    if (saved) {
      try {
        const resultInfo = JSON.parse(saved)
        if (Date.now() - (resultInfo.timestamp || 0) <= 24 * 60 * 60 * 1000) {
          return resultInfo.matchResult
        }
      } catch (e) {
        console.error('获取最近结果失败:', e)
        localStorage.removeItem(RESULT_STORAGE_KEY)
      }
    }
    return null
  }

  function clearResult() {
    localStorage.removeItem(RESULT_STORAGE_KEY)
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
    allMatches,
    otherHighMatches,

    // 方法
    setAnswer,
    goToNext,
    goToPrev,
    completeTest,
    resetTest,
    saveProgress,
    loadProgress,
    hasSavedProgress,
    hasRecentResult,
    getLastResult,
    clearResult,
    
    // 实验性选项方法
    setWeightedMode,
    setMultiResultMode,
    getWeightedMode,
    getMultiResultMode,
    
    // 昵称方法
    nickname,
    saveNickname
  }
})
